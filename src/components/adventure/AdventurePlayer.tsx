import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { PlayAudioButton } from "@/components/audio/PlayAudioButton"
import { ExperienceScene, MiniMap, sceneForExperience } from "@/components/adventure/ExperienceScenes"
import { OptionButton, RegisterBadge } from "@/components/adventure/AdventureBits"
import { PhraseBuilder } from "@/components/adventure/PhraseBuilder"
import { BackButton } from "@/components/app-shell/BackButton"
import { Button } from "@/components/ui/button"
import { getAdventure } from "@/data/learning/adventures"
import { getCapability } from "@/data/learning/capabilities"
import { getSideMission } from "@/data/learning/side-missions"
import { getLearningWord } from "@/data/learning/words"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useTabNavigation } from "@/lib/tab-navigation"
import { createRunById } from "@/lib/adventure-engine"
import { getStudyResources } from "@/data/learning/study-resources"
import { StudyResources } from "@/components/adventure/StudyResources"
import { useI18n } from "@/lib/i18n"
import type { AdventureStep, DirectionAction, GpsInstruction, SceneFocus, StudyGroup, StudyResource } from "@/lib/learning-types"

function useDirectionLabels() {
  const { t } = useI18n()
  return {
    left: t("adventure.directions.left"),
    right: t("adventure.directions.right"),
    straight: t("adventure.directions.straight"),
    up: t("adventure.directions.up"),
    down: t("adventure.directions.down"),
    stop: t("adventure.directions.stop"),
    arrive: t("adventure.directions.arrive"),
  } as Record<string, string>
}

export function AdventurePlayer({
  experienceId,
  returnTo,
  onStudyComplete,
  skipIntro = false,
}: {
  experienceId: string
  returnTo?: string
  onStudyComplete?: () => void
  skipIntro?: boolean
}) {
  const { completeAdventure, discoverWord } = useAppState()
  const { progress } = useActiveJourney()
  const { t } = useI18n()
  const [session, setSession] = useState(0)
  const [runBundle, setRunBundle] = useState(() =>
    createRunById(experienceId, progress.capabilities, `${experienceId}-0`),
  )
  const steps = runBundle.run.steps
  const skipsContext = skipIntro && steps[0]?.type === "context"
  const initialStep = skipsContext ? 1 : 0
  const [stepIndex, setStepIndex] = useState(initialStep)
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState(false)

  const adventure = getAdventure(experienceId)
  const side = getSideMission(experienceId)
  const step = steps[stepIndex]
  const isLast = stepIndex >= steps.length - 1
  const isStudySession = runBundle.kind === "side" && steps.every((item) => item.type === "study")
  const isPractice = runBundle.kind === "side"
  const showTransliteration = isPractice
  const showTranslation = isPractice
  const stepTotal = skipsContext ? steps.length - 1 : steps.length
  const stepNumber = skipsContext ? stepIndex : stepIndex + 1

  function saveProgress() {
    if (saved) return
    completeAdventure({
      id: experienceId,
      kind: runBundle.kind,
      vocabularyIds: runBundle.run.selectedVocabularyIds,
      rewards: adventure?.capabilityRewards,
      capabilityId: side?.capabilityId,
      capabilityLevel: side?.capabilityLevel,
      outcome: runBundle.run.outcome,
    })
    setSaved(true)
  }

  function finish() {
    saveProgress()
    setFinished(true)
  }

  function finishStudy() {
    saveProgress()
    if (onStudyComplete) {
      onStudyComplete()
      return
    }
    setFinished(true)
  }

  function next() {
    if (isLast) finish()
    else setStepIndex((index) => index + 1)
  }

  if (finished) {
    return (
      <Completion
        experienceId={experienceId}
        title={runBundle.title}
        outcome={runBundle.run.outcome}
        canNowDo={runBundle.canNowDo}
        vocabIds={runBundle.run.selectedVocabularyIds}
        advanced={runBundle.run.advanced}
        kind={runBundle.kind}
        returnTo={returnTo}
        capabilityId={side?.capabilityId ?? (adventure ? Object.keys(adventure.capabilityRewards)[0] : undefined)}
        onReplay={() => {
          const nextSession = session + 1
          const nextBundle = createRunById(experienceId, progress.capabilities, `${experienceId}-${nextSession}`)
          const nextSteps = nextBundle.run.steps
          const nextSkipsContext = skipIntro && nextSteps[0]?.type === "context"
          setFinished(false)
          setSaved(false)
          setStepIndex(nextSkipsContext ? 1 : 0)
          setSession(nextSession)
          setRunBundle(nextBundle)
        }}
      />
    )
  }

  return (
    <div className="space-y-5 pb-10">
      <header>
        <BackButton />
        <p className="text-[11px] font-semibold tracking-[0.18em] text-terracotta uppercase">
          {runBundle.kind === "side" ? t("adventure.prep") : t("adventure.mission")}
        </p>
        <h1 className="font-display mt-1 text-2xl leading-tight">{runBundle.title}</h1>
        {isStudySession && side?.description ? (
          <p className="mt-2 text-sm text-muted-foreground">{side.description}</p>
        ) : null}
        {!isStudySession ? (
          <>
            <p className="mt-1 text-xs text-muted-foreground">
              {stepNumber} of {stepTotal}
              {runBundle.run.advanced ? " · Richer vocabulary enabled" : ""}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-terracotta"
                style={{ width: `${(stepNumber / stepTotal) * 100}%` }}
              />
            </div>
          </>
        ) : null}
      </header>

      {step ? (
        <StepView
          key={stepIndex}
          step={step}
          experienceId={experienceId}
          scene={sceneForExperience(experienceId)}
          variables={runBundle.run.variables}
          complication={runBundle.run.selectedComplicationId}
          showTransliteration={showTransliteration}
          showTranslation={showTranslation}
          onDiscover={discoverWord}
          onContinue={next}
          onFinishStudy={finishStudy}
        />
      ) : null}
    </div>
  )
}

function focusFor(step: AdventureStep): SceneFocus {
  if (step.type === "phrase") return "plaque"
  if (step.type === "listen") return "guard"
  if (step.type === "direction") return step.correct === "up" ? "stairs" : "doors"
  if (step.type === "decision") return "doors"
  return "place"
}

function isStreetScene(scene: string) {
  return scene === "haram-gate" || scene === "street" || scene === "crowd"
}

function StepView({
  step,
  experienceId,
  scene,
  variables,
  complication,
  showTransliteration,
  showTranslation,
  onDiscover,
  onContinue,
  onFinishStudy,
}: {
  step: AdventureStep
  experienceId: string
  scene: ReturnType<typeof sceneForExperience>
  variables: Record<string, string | number>
  complication?: string
  showTransliteration: boolean
  showTranslation: boolean
  onDiscover: (id: string) => void
  onContinue: () => void
  onFinishStudy: () => void
}) {
  const ownsScene = step.type === "context" || step.type === "direction" || step.type === "gps"
  const sceneFrame = !ownsScene ? (
    <ExperienceScene
      scene={scene}
      compact
      gateNumber={variables.gateNumber}
      complication={
        step.type === "decision"
          ? complication === "closed-door"
            ? "closed"
            : complication
          : undefined
      }
      focus={focusFor(step)}
    />
  ) : null

  if (step.type === "context") {
    return (
      <div className="space-y-4">
        <ExperienceScene scene={step.scene} gateNumber={variables.gateNumber} focus="place" />
        <h2 className="font-display text-2xl">{step.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        <Button className="w-full" variant="terracotta" onClick={onContinue}>
          Enter the scene
        </Button>
      </div>
    )
  }

  if (step.type === "discover") {
    return (
      <div className="space-y-4">
        {sceneFrame}
        <DiscoverStep
          prompt={step.prompt}
          vocabIds={step.vocabIds}
          showTransliteration={showTransliteration}
          showTranslation={showTranslation}
          onDiscover={onDiscover}
          onContinue={onContinue}
        />
      </div>
    )
  }

  if (step.type === "study") {
    return (
      <StudyStep
        packId={experienceId}
        groups={step.groups}
        resources={getStudyResources(experienceId)}
        onDiscover={onDiscover}
        onFinish={onFinishStudy}
      />
    )
  }

  if (step.type === "phrase") {
    return (
      <div className="space-y-4">
        {sceneFrame}
        <PhraseBuilder
          prompt={step.prompt}
          tokens={step.tokens}
          correctOrder={step.correctOrder}
          onContinue={onContinue}
        />
      </div>
    )
  }

  if (step.type === "gps") {
    return (
      <GpsStep
        packId={experienceId}
        prompt={step.prompt}
        instructions={step.instructions}
        showTranslation={showTranslation}
        onContinue={onContinue}
      />
    )
  }

  if (step.type === "direction") {
    return (
      <DirectionStep
        step={step}
        scene={scene}
        gateNumber={variables.gateNumber}
        onContinue={onContinue}
      />
    )
  }

  return (
    <div className="space-y-4">
      {sceneFrame}
      <ChoiceStep
        packId={experienceId}
        prompt={step.prompt}
        arabic={"arabic" in step ? step.arabic : undefined}
        audioId={step.type === "listen" ? step.audioId : undefined}
        situation={step.type === "decision" ? step.situation : undefined}
        options={step.options}
        correctId={"correctId" in step ? step.correctId : ""}
        listen={step.type === "listen"}
        feedback={"feedback" in step ? step.feedback : undefined}
        showTransliteration={showTransliteration}
        showTranslation={showTranslation}
        onContinue={onContinue}
      />
    </div>
  )
}

function StudyStep({
  packId,
  groups,
  resources,
  onDiscover,
  onFinish,
}: {
  packId: string
  groups: StudyGroup[]
  resources: StudyResource[]
  onDiscover: (id: string) => void
  onFinish: () => void
}) {
  const discovered = useRef(false)

  useEffect(() => {
    if (discovered.current) return
    discovered.current = true
    for (const group of groups) {
      for (const id of group.vocabIds) onDiscover(id)
    }
  }, [groups, onDiscover])

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.title} className="space-y-3">
          {group.scene ? <ExperienceScene scene={group.scene} compact className="h-32 w-full" /> : null}
          <div>
            <h2 className="font-display text-xl leading-tight">{group.title}</h2>
            {group.intro ? <p className="mt-1 text-sm text-muted-foreground">{group.intro}</p> : null}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            {group.vocabIds.map((id, index) => {
              const word = getLearningWord(id)
              if (!word) return null
              return (
                <article
                  key={id}
                  className={
                    index > 0
                      ? "grid grid-cols-2 border-t border-border"
                      : "grid grid-cols-2"
                  }
                >
                  <div className="flex min-w-0 flex-col justify-center border-r border-border px-4 py-3.5">
                    <p className="text-sm font-medium text-ink">{word.meaning}</p>
                    {word.transliteration ? (
                      <p className="mt-0.5 text-xs italic text-ink-soft">{word.transliteration}</p>
                    ) : null}
                    <div className="mt-1.5">
                      <RegisterBadge register={word.register} />
                    </div>
                  </div>
                  <div className="flex min-w-0 items-center justify-end gap-2 px-4 py-3.5">
                    <p className="arabic-text text-2xl leading-none" dir="rtl">
                      {word.arabic}
                    </p>
                    <PlayAudioButton packId={packId} clipId={id} variant="ghost" />
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}
      <StudyResources items={resources} />
      <Button type="button" className="w-full" variant="terracotta" onClick={onFinish}>
        Done studying
      </Button>
    </div>
  )
}

function DiscoverStep({
  prompt,
  vocabIds,
  showTransliteration,
  showTranslation,
  onDiscover,
  onContinue,
}: {
  prompt: string
  vocabIds: string[]
  showTransliteration: boolean
  showTranslation: boolean
  onDiscover: (id: string) => void
  onContinue: () => void
}) {
  const [open, setOpen] = useState<string[]>([])
  const allOpen = vocabIds.every((id) => open.includes(id))
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{prompt}</p>
      <div className="grid gap-2">
        {vocabIds.map((id) => {
          const word = getLearningWord(id)
          const revealed = open.includes(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (!revealed) {
                  setOpen((current) => [...current, id])
                  onDiscover(id)
                }
              }}
              className="rounded-3xl border border-border bg-card p-4 text-start"
            >
              <p className="arabic-text text-3xl">{word?.arabic}</p>
              {revealed ? (
                <>
                  <div className="mt-2">
                    <RegisterBadge register={word?.register} />
                  </div>
                  {showTransliteration ? (
                    <p className="mt-1 text-sm italic text-ink-soft">{word?.transliteration}</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">Stay with the Arabic first.</p>
                  )}
                  {showTranslation ? <p className="mt-1 font-medium">{word?.meaning}</p> : null}
                </>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">Tap to notice this word</p>
              )}
            </button>
          )
        })}
      </div>
      <Button className="w-full" disabled={!allOpen} onClick={onContinue}>
        {allOpen ? "Continue" : "Notice each word first"}
      </Button>
    </div>
  )
}

function ChoiceStep({
  packId,
  prompt,
  arabic,
  audioId,
  situation,
  options,
  correctId,
  listen,
  feedback,
  showTransliteration,
  showTranslation,
  onContinue,
}: {
  packId: string
  prompt: string
  arabic?: string
  audioId?: string
  situation?: string
  options: { id: string; label: string; arabic?: string }[]
  correctId: string
  listen?: boolean
  feedback?: string
  showTransliteration?: boolean
  showTranslation?: boolean
  onContinue: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const revealed = Boolean(selected)
  const correct = selected === correctId
  const clipId = audioId
  const adventureMode = !showTransliteration && !showTranslation
  const arabicFirst = adventureMode && options.some((option) => option.arabic)
  return (
    <div className="space-y-4">
      {situation ? <p className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm leading-relaxed">{situation}</p> : null}
      <p className="text-sm font-medium text-ink">{prompt}</p>
      {listen && clipId ? (
        <PlayAudioButton
          packId={packId}
          clipId={clipId}
          autoPlay
          size="default"
          label="Listen"
        />
      ) : null}
      {arabic && (!listen || revealed) ? <p className="arabic-text text-center text-4xl">{arabic}</p> : null}
      <div className="grid gap-2">
        {options.map((option) => (
          <OptionButton
            key={option.id}
            selected={selected === option.id}
            correct={option.id === correctId}
            revealed={revealed}
            onClick={() => setSelected(option.id)}
          >
            {arabicFirst && option.arabic ? (
              <>
                <span className="arabic-text block text-xl leading-relaxed">{option.arabic}</span>
                {revealed ? (
                  <span className="mt-1 block text-sm font-normal text-muted-foreground">{option.label}</span>
                ) : null}
              </>
            ) : (
              <>
                <span className="block">{option.label}</span>
                {option.arabic && (!adventureMode || revealed) ? (
                  <span className="arabic-text mt-1 block text-xl font-normal">{option.arabic}</span>
                ) : null}
              </>
            )}
          </OptionButton>
        ))}
      </div>
      {revealed && feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
      {revealed && !correct ? <p className="text-sm text-muted-foreground">Try another answer.</p> : null}
      <Button className="w-full" disabled={!correct} onClick={onContinue}>
        Continue
      </Button>
    </div>
  )
}

function DirectionStep({
  step,
  scene,
  gateNumber,
  onContinue,
}: {
  step: Extract<AdventureStep, { type: "direction" }>
  scene: ReturnType<typeof sceneForExperience>
  gateNumber?: string | number
  onContinue: () => void
}) {
  const { t } = useI18n()
  const directionLabel = useDirectionLabels()
  const [selected, setSelected] = useState<DirectionAction | null>(null)
  const correct = selected === step.correct
  const street = isStreetScene(scene)
  return (
    <div className="space-y-4">
      {street ? (
        <ExperienceScene
          scene={scene}
          gateNumber={gateNumber}
          focus={step.correct === "up" ? "stairs" : "doors"}
          interactive
          availableDirections={step.options}
          selectedDirection={selected}
          correctDirection={step.correct}
          highlight={correct ? step.correct : undefined}
          onChooseDirection={setSelected}
        />
      ) : (
        <MiniMap highlight={selected && correct ? step.correct : undefined} />
      )}
      <p className="text-sm text-muted-foreground">{step.prompt}</p>
      {selected ? <p className="arabic-text text-center text-4xl">{step.arabic}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        {step.options.map((option) => (
          <OptionButton
            key={option}
            selected={selected === option}
            correct={option === step.correct}
            revealed={Boolean(selected)}
            onClick={() => setSelected(option)}
          >
            {directionLabel[option]}
          </OptionButton>
        ))}
      </div>
      <Button className="w-full" disabled={!correct} onClick={onContinue}>
        {t("adventure.continue")}
      </Button>
    </div>
  )
}

function GpsStep({
  packId,
  prompt,
  instructions,
  showTranslation,
  onContinue,
}: {
  packId: string
  prompt: string
  instructions: GpsInstruction[]
  showTranslation: boolean
  onContinue: () => void
}) {
  const { t } = useI18n()
  const directionLabel = useDirectionLabels()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const current = instructions[index]
  if (!current) return null
  const actions = ["straight", "right", "left", "stop", "arrive"] as const
  const correct = selected === current.action
  const last = index === instructions.length - 1
  return (
    <div className="space-y-4">
      <MiniMap highlight={correct ? current.action : undefined} />
      <p className="text-sm text-muted-foreground">{prompt}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Instruction {index + 1} of {instructions.length}
      </p>
      {current.audioId ? (
        <PlayAudioButton
          key={`${index}-${current.audioId}`}
          packId={packId}
          clipId={current.audioId}
          autoPlay
          size="default"
          label={t("adventure.listenAgain")}
        />
      ) : null}
      {selected ? <p className="arabic-text text-center text-3xl leading-relaxed">{current.arabic}</p> : null}
      {showTranslation ? <p className="text-center text-sm text-muted-foreground">{current.meaning}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <OptionButton
            key={action}
            selected={selected === action}
            correct={action === current.action}
            revealed={Boolean(selected)}
            onClick={() => setSelected(action)}
          >
            {directionLabel[action]}
          </OptionButton>
        ))}
      </div>
      <Button
        className="w-full"
        disabled={!correct}
        onClick={() => {
          if (last) onContinue()
          else {
            setIndex((value) => value + 1)
            setSelected(null)
          }
        }}
      >
        {last ? t("adventure.arrive") : t("adventure.nextInstruction")}
      </Button>
    </div>
  )
}

function Completion({
  experienceId,
  outcome,
  canNowDo,
  vocabIds,
  advanced,
  kind,
  capabilityId,
  returnTo,
  onReplay,
}: {
  experienceId?: string
  title?: string
  outcome: string
  canNowDo: string
  vocabIds: string[]
  advanced?: boolean
  kind: "adventure" | "side"
  capabilityId?: string
  returnTo?: string
  onReplay: () => void
}) {
  const { resetTabToRoot } = useTabNavigation()
  const { t, capability: capabilityCopy } = useI18n()
  const capability = capabilityId ? getCapability(capabilityId as "navigation") : undefined
  const localizedCapability = capabilityId ? capabilityCopy(capabilityId) : undefined
  const words = vocabIds.map((id) => getLearningWord(id)).filter(Boolean)
  const isStudy = kind === "side"
  const isMission = kind === "adventure"

  return (
    <div className="space-y-5 pb-10">
      <BackButton />
      {!isStudy && experienceId ? (
        <ExperienceScene scene={sceneForExperience(experienceId)} className="h-36" />
      ) : null}
      <header className={isStudy ? "rounded-[1.75rem] bg-sky/10 p-5" : "rounded-[1.75rem] bg-sage/10 p-5"}>
        <p
          className={
            isStudy
              ? "text-[11px] font-semibold tracking-[0.18em] text-sky-deep uppercase"
              : "text-[11px] font-semibold tracking-[0.18em] text-sage-deep uppercase"
          }
        >
          {isStudy ? t("adventure.studyComplete") : t("adventure.missionComplete")}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{outcome}</h1>
        {advanced ? (
          <p className="mt-2 text-sm text-sage-deep">{t("mission.richerVocab")}</p>
        ) : null}
      </header>

      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {isStudy ? t("adventure.youStudied") : t("adventure.youCanNow")}
        </p>
        <p className="mt-2 text-base leading-relaxed">{canNowDo}</p>
        {capability ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {localizedCapability?.title ?? capability.title} · {isStudy ? t("adventure.prep") : t("adventure.mission")}
          </p>
        ) : null}
      </section>

      <section>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {isStudy ? t("adventure.wordsInLesson") : t("adventure.wordsUsed")}
        </p>
        <p className="arabic-text mt-3 text-2xl leading-relaxed" dir="rtl">{words.map((word) => word?.arabic).join(" · ")}</p>
      </section>

      {isMission ? (
        <button
          type="button"
          onClick={() => resetTabToRoot("home")}
          className="flex min-h-12 w-full items-center justify-center rounded-full bg-terracotta font-semibold text-white"
        >
          {t("common.backToMap")}
        </button>
      ) : (
        <Link
          to={isStudy ? (returnTo ?? "/") : "/"}
          className="flex min-h-12 items-center justify-center rounded-full bg-terracotta font-semibold text-white"
        >
          {isStudy ? (returnTo ? t("adventure.backToMission") : t("common.backToMap")) : t("common.backToMap")}
        </Link>
      )}
      <Button variant="outline" className="w-full" onClick={onReplay}>
        {isStudy ? t("adventure.studyAgain") : t("common.playAgain")}
      </Button>
    </div>
  )
}
