import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { StudyView } from "@/components/study/StudyView"
import { PlayAudioButton } from "@/components/audio/PlayAudioButton"
import { ExperienceScene, MiniMap, sceneForExperience } from "@/components/mission/ExperienceScenes"
import { MissionAudioHints } from "@/components/mission/MissionAudioHints"
import { OfficerPromptStep } from "@/components/mission/OfficerPromptStep"
import { MissionCelebration } from "@/components/mission/MissionCelebration"
import { MissionStepDebugNav } from "@/components/mission/MissionStepDebugNav"
import { MatchItemsStep } from "@/components/mission/MatchItemsStep"
import { OptionButton, RegisterBadge, useMcqAnswer, useShuffledOptions } from "@/components/mission/MissionBits"
import { PhraseBuilder } from "@/components/mission/PhraseBuilder"
import { BackButton } from "@/components/app-shell/BackButton"
import { Button } from "@/components/ui/button"
import { getMission } from "@/data/learning/missions"
import { getCapability } from "@/data/learning/capabilities"
import { getLesson } from "@/data/learning/lessons"
import { getLearningWord } from "@/data/learning/words"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useMissionNavigationGuard } from "@/lib/mission-navigation-guard"
import { useTabNavigation } from "@/lib/tab-navigation"
import { createRunById } from "@/lib/mission-engine"
import { getStudyResources } from "@/data/learning/study-resources"
import { StudyResources } from "@/components/mission/StudyResources"
import { useI18n } from "@/lib/i18n"
import { resolveMissionOutcome, resolveMissionStepCopy } from "@/lib/mission-copy"
import type { VocabBookmark } from "@/lib/bookmarks"
import { hasBookmark } from "@/lib/bookmarks"
import type { ChoiceOption, MissionStep, DirectionAction, GpsInstruction, SceneFocus, StudyGroup, StudyResource } from "@/lib/learning-types"

function useDirectionLabels() {
  const { t } = useI18n()
  return {
    left: t("play.directions.left"),
    right: t("play.directions.right"),
    straight: t("play.directions.straight"),
    up: t("play.directions.up"),
    down: t("play.directions.down"),
    stop: t("play.directions.stop"),
    arrive: t("play.directions.arrive"),
  } as Record<string, string>
}

export function MissionPlayer({
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
  const { completeMission, discoverWord, toggleBookmark } = useAppState()
  const { progress } = useActiveJourney()
  const { t, missionDetail, lessonDetail, lessonTitle, pack, language } = useI18n()
  const { setMissionInProgress } = useMissionNavigationGuard()
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

  const mission = getMission(experienceId)
  const lesson = getLesson(experienceId)
  const step = steps[stepIndex]
  const isLast = stepIndex >= steps.length - 1
  const isStudySession = runBundle.kind === "lesson" && steps.every((item) => item.type === "study")
  const isPractice = runBundle.kind === "lesson"
  const showTransliteration = isPractice && language === "en"
  const showTranslation = isPractice
  const stepTotal = skipsContext ? steps.length - 1 : steps.length
  const stepNumber = skipsContext ? stepIndex : stepIndex + 1
  const placeCopy = missionDetail(experienceId)
  const lessonCopy = lessonDetail(experienceId)
  const displayTitle = lesson
    ? lessonTitle(lesson)
    : (placeCopy?.title ?? runBundle.title)
  const displayCanNowDo = lesson
    ? (lessonCopy?.canNowDo ?? runBundle.canNowDo)
    : (placeCopy?.canNowDo ?? runBundle.canNowDo)
  const displayOutcome = lesson
    ? (pack.lessonRuns[experienceId]?.outcome ?? runBundle.run.outcome)
    : resolveMissionOutcome(pack, experienceId, runBundle.run.outcome)
  const displayDescription = lesson
    ? (lessonCopy?.description ?? lesson.description)
    : undefined

  useEffect(() => {
    const active = runBundle.kind === "mission" && !finished
    setMissionInProgress(active)
    return () => setMissionInProgress(false)
  }, [finished, runBundle.kind, setMissionInProgress])

  function saveProgress() {
    if (saved) return
    completeMission({
      id: experienceId,
      kind: runBundle.kind,
      vocabularyIds: runBundle.run.selectedVocabularyIds,
      rewards: mission?.capabilityRewards,
      capabilityId: lesson?.capabilityId,
      capabilityLevel: lesson?.capabilityLevel,
      outcome: runBundle.run.outcome,
    })
    setSaved(true)
  }

  function finish() {
    saveProgress()
    setFinished(true)
  }

  function jumpToStep(index: number) {
    if (index < 0 || index >= steps.length) return
    setFinished(false)
    setStepIndex(index)
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
        title={displayTitle}
        outcome={displayOutcome}
        canNowDo={displayCanNowDo}
        vocabIds={runBundle.run.selectedVocabularyIds}
        advanced={runBundle.run.advanced}
        kind={runBundle.kind}
        returnTo={returnTo}
        capabilityId={lesson?.capabilityId ?? (mission ? Object.keys(mission.capabilityRewards)[0] : undefined)}
        lessonCompleted={lesson ? progress.completedLessonIds.includes(experienceId) : false}
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
        <BackButton to={returnTo} />
        <p className="text-[11px] font-semibold tracking-[0.18em] text-terracotta uppercase">
          {runBundle.kind === "lesson" ? t("play.study") : t("play.mission")}
        </p>
        <h1 className="font-display mt-1 text-2xl leading-tight">{displayTitle}</h1>
        {isStudySession && displayDescription ? (
          <p className="mt-2 text-sm text-muted-foreground">{displayDescription}</p>
        ) : null}
        {!isStudySession ? (
          <>
            <p className="mt-1 text-xs text-muted-foreground">
              {stepNumber} {t("common.of")} {stepTotal}
              {runBundle.run.advanced ? ` · ${t("play.richerVocabEnabled")}` : ""}
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

      {!isStudySession ? (
        <MissionStepDebugNav steps={steps} stepIndex={stepIndex} onJump={jumpToStep} />
      ) : null}

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
          bookmarkedVocab={progress.bookmarkedVocab}
          onDiscover={discoverWord}
          onToggleBookmark={toggleBookmark}
          onContinue={next}
          onFinishStudy={finishStudy}
        />
      ) : null}
    </div>
  )
}

function focusFor(step: MissionStep): SceneFocus {
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
  bookmarkedVocab,
  onDiscover,
  onToggleBookmark,
  onContinue,
  onFinishStudy,
}: {
  step: MissionStep
  experienceId: string
  scene: ReturnType<typeof sceneForExperience>
  variables: Record<string, string | number>
  complication?: string
  showTransliteration: boolean
  showTranslation: boolean
  bookmarkedVocab: VocabBookmark[]
  onDiscover: (id: string) => void
  onToggleBookmark: (lessonId: string, wordId: string) => void
  onContinue: () => void
  onFinishStudy: () => void
}) {
  const { t, pack, word } = useI18n()
  const copyKey = "copyKey" in step ? step.copyKey : undefined
  const copy = resolveMissionStepCopy(pack, experienceId, copyKey, {
    title: step.type === "context" ? step.title : undefined,
    body: step.type === "context" ? step.body : undefined,
    prompt: "prompt" in step ? step.prompt : undefined,
    promptEnglish: "promptEnglish" in step ? step.promptEnglish : undefined,
    question: "question" in step ? step.question : undefined,
    feedback: "feedback" in step ? step.feedback : undefined,
    situation: step.type === "decision" ? step.situation : undefined,
  })

  function localizeOptions(options: ChoiceOption[]) {
    return options.map((option) => ({
      ...option,
      label: word(option.id, option.label),
    }))
  }

  const ownsScene = step.type === "context" || step.type === "direction" || step.type === "gps"
  const sceneFrame = !ownsScene ? (
    <ExperienceScene
      scene={scene}
      missionId={experienceId}
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
        <ExperienceScene
          scene={step.scene}
          missionId={experienceId}
          gateNumber={variables.gateNumber}
          focus="place"
        />
        <h2 className="font-display text-2xl">{copy.title ?? step.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy.body ?? step.body}</p>
        <Button className="w-full" variant="terracotta" onClick={onContinue}>
          {t("play.enterScene")}
        </Button>
      </div>
    )
  }

  if (step.type === "discover") {
    return (
      <div className="space-y-4">
        {sceneFrame}
        <DiscoverStep
          prompt={copy.prompt ?? step.prompt}
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
        bookmarkedVocab={bookmarkedVocab}
        onDiscover={onDiscover}
        onToggleBookmark={onToggleBookmark}
        onFinish={onFinishStudy}
      />
    )
  }

  if (step.type === "phrase") {
    return (
      <div className="space-y-4">
        {sceneFrame}
        <PhraseReplyStep
          packId={experienceId}
          prompt={copy.prompt ?? step.prompt}
          audioId={step.audioId}
          officerArabic={step.officerArabic}
          audioTranslation={copy.promptEnglish ?? step.promptEnglish}
          question={copy.question ?? step.question}
          feedback={copy.feedback ?? step.feedback}
          tokens={step.tokens}
          correctOrder={step.correctOrder}
          onContinue={onContinue}
        />
      </div>
    )
  }

  if (step.type === "match") {
    return (
      <div className="space-y-4">
        {sceneFrame}
        <MatchItemsStep
          prompt={copy.prompt ?? step.prompt}
          question={copy.question ?? step.question}
          itemIds={step.itemIds}
          feedback={copy.feedback ?? step.feedback}
          onContinue={onContinue}
        />
      </div>
    )
  }

  if (step.type === "listen" && step.audioId) {
    return (
      <div className="space-y-4">
        {sceneFrame}
        <OfficerPromptStep
          packId={experienceId}
          prompt={copy.prompt ?? step.prompt}
          audioTranslation={copy.promptEnglish ?? step.promptEnglish}
          officerArabic={step.arabic}
          audioId={step.audioId}
          question={copy.question ?? step.question}
          options={localizeOptions(step.options)}
          correctId={step.correctId}
          feedback={copy.feedback ?? step.feedback}
          onContinue={onContinue}
        />
      </div>
    )
  }

  if (step.type === "choice" && step.audioId) {
    return (
      <div className="space-y-4">
        {sceneFrame}
        <OfficerPromptStep
          packId={experienceId}
          prompt={copy.prompt ?? step.prompt}
          audioTranslation={copy.promptEnglish ?? step.promptEnglish}
          officerArabic={step.arabic}
          audioId={step.audioId}
          question={copy.question ?? step.question}
          options={localizeOptions(step.options)}
          correctId={step.correctId}
          feedback={copy.feedback ?? step.feedback}
          onContinue={onContinue}
        />
      </div>
    )
  }

  if (step.type === "gps") {
    return (
      <GpsStep
        packId={experienceId}
        prompt={copy.prompt ?? step.prompt}
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
        prompt={copy.prompt ?? ("prompt" in step ? step.prompt : "")}
        arabic={"arabic" in step ? step.arabic : undefined}
        audioId={step.type === "listen" ? step.audioId : undefined}
        situation={copy.situation}
        options={localizeOptions("options" in step ? step.options : [])}
        correctId={"correctId" in step ? step.correctId : ""}
        listen={step.type === "listen"}
        feedback={copy.feedback}
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
  bookmarkedVocab,
  onDiscover,
  onToggleBookmark,
  onFinish,
}: {
  packId: string
  groups: StudyGroup[]
  resources: StudyResource[]
  bookmarkedVocab: VocabBookmark[]
  onDiscover: (id: string) => void
  onToggleBookmark: (lessonId: string, wordId: string) => void
  onFinish: () => void
}) {
  const { t } = useI18n()
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
      <StudyView
        packId={packId}
        groups={groups}
        isBookmarked={(id) => hasBookmark(bookmarkedVocab, packId, id)}
        onToggleBookmark={(id) => onToggleBookmark(packId, id)}
      />
      <StudyResources items={resources} />
      <Button type="button" className="w-full" variant="terracotta" onClick={onFinish}>
        {t("common.done")}
      </Button>
    </div>
  )
}

function PhraseReplyStep({
  packId,
  prompt,
  audioId,
  officerArabic,
  audioTranslation,
  question,
  feedback,
  tokens,
  correctOrder,
  onContinue,
}: {
  packId: string
  prompt: string
  audioId?: string
  officerArabic?: string
  audioTranslation?: string
  question?: string
  feedback?: string
  tokens: string[]
  correctOrder: string[]
  onContinue: () => void
}) {
  const { t } = useI18n()
  const [solved, setSolved] = useState(false)
  const questionText = question ?? t("play.buildYourReply")

  return (
    <div className="space-y-3">
      {audioId ? (
        <MissionAudioHints
          prompt={prompt}
          packId={packId}
          utterances={[{ audioId, arabic: officerArabic, translation: audioTranslation }]}
        />
      ) : (
        <p className="rounded-2xl border border-border/60 bg-secondary/35 px-3 py-2.5 text-sm leading-snug text-muted-foreground">
          {prompt}
        </p>
      )}
      <p className="text-sm font-medium text-ink">{questionText}</p>
      <PhraseBuilder tokens={tokens} correctOrder={correctOrder} onSolved={() => setSolved(true)} />
      {solved && feedback ? (
        <p className="rounded-2xl bg-sage/10 px-4 py-3 text-sm leading-relaxed text-sage-deep">{feedback}</p>
      ) : null}
      <Button className="w-full" variant="terracotta" disabled={!solved} onClick={onContinue}>
        {t("play.continue")}
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
  const { t, word: gloss } = useI18n()
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
                    <p className="mt-1 text-xs text-muted-foreground">{t("play.stayWithArabic")}</p>
                  )}
                  {showTranslation && word ? (
                    <p className="mt-1 font-medium">{gloss(id, word.meaning)}</p>
                  ) : null}
                </>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">{t("play.tapToNotice")}</p>
              )}
            </button>
          )
        })}
      </div>
      <Button className="w-full" disabled={!allOpen} onClick={onContinue}>
        {allOpen ? t("play.continue") : t("play.noticeWords")}
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
  const { t } = useI18n()
  const shuffledOptions = useShuffledOptions(options)
  const { solved, select, optionState, showOptionDetail, selectedId } = useMcqAnswer(correctId)
  const clipId = audioId
  const immersiveMode = !showTransliteration && !showTranslation
  const arabicFirst = immersiveMode && shuffledOptions.some((option) => option.arabic)
  return (
    <div className="space-y-4">
      {situation ? <p className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm leading-relaxed">{situation}</p> : null}
      <p className="text-sm font-medium text-ink">{prompt}</p>
      {listen && clipId ? (
        <div className="flex justify-center py-0.5">
          <PlayAudioButton packId={packId} clipId={clipId} size="icon" variant="secondary" label={t("play.listen")} />
        </div>
      ) : null}
      {arabic && (!listen || selectedId !== null) ? <p className="arabic-text text-center text-4xl">{arabic}</p> : null}
      <div className="grid gap-2">
        {shuffledOptions.map((option) => (
          <OptionButton
            key={option.id}
            state={optionState(option.id)}
            disabled={solved}
            onClick={() => select(option.id)}
          >
            {arabicFirst && option.arabic ? (
              <>
                <span className="arabic-text block text-xl leading-relaxed">{option.arabic}</span>
                {showOptionDetail(option.id) ? (
                  <span className="mt-1 block text-sm font-normal text-muted-foreground">{option.label}</span>
                ) : null}
              </>
            ) : (
              <>
                <span className="block">{option.label}</span>
                {option.arabic && (!immersiveMode || showOptionDetail(option.id)) ? (
                  <span className="arabic-text mt-1 block text-xl font-normal">{option.arabic}</span>
                ) : null}
              </>
            )}
          </OptionButton>
        ))}
      </div>
      {solved && feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
      {!solved && selectedId ? <p className="text-sm text-muted-foreground">{t("play.tryAnother")}</p> : null}
      <Button className="w-full" disabled={!solved} onClick={onContinue}>
        {t("play.continue")}
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
  step: Extract<MissionStep, { type: "direction" }>
  scene: ReturnType<typeof sceneForExperience>
  gateNumber?: string | number
  onContinue: () => void
}) {
  const { t } = useI18n()
  const directionLabel = useDirectionLabels()
  const { solved, select, optionState, selectedId } = useMcqAnswer(step.correct)
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
          selectedDirection={selectedId as DirectionAction | null}
          correctDirection={step.correct}
          highlight={solved ? step.correct : undefined}
          onChooseDirection={(direction) => {
            if (!solved) select(direction)
          }}
        />
      ) : (
        <MiniMap highlight={solved ? step.correct : undefined} />
      )}
      <p className="text-sm text-muted-foreground">{step.prompt}</p>
      {selectedId ? <p className="arabic-text text-center text-4xl">{step.arabic}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        {step.options.map((option) => (
          <OptionButton
            key={option}
            state={optionState(option)}
            disabled={solved}
            onClick={() => select(option)}
          >
            {directionLabel[option]}
          </OptionButton>
        ))}
      </div>
      <Button className="w-full" disabled={!solved} onClick={onContinue}>
        {t("play.continue")}
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
  const [index, setIndex] = useState(0)
  const current = instructions[index]
  if (!current) return null
  const last = index === instructions.length - 1

  return (
    <GpsInstructionStep
      key={index}
      packId={packId}
      prompt={prompt}
      instruction={current}
      instructionNumber={index + 1}
      instructionTotal={instructions.length}
      showTranslation={showTranslation}
      last={last}
      onNext={() => {
        if (last) onContinue()
        else setIndex((value) => value + 1)
      }}
    />
  )
}

function GpsInstructionStep({
  packId,
  prompt,
  instruction,
  instructionNumber,
  instructionTotal,
  showTranslation,
  last,
  onNext,
}: {
  packId: string
  prompt: string
  instruction: GpsInstruction
  instructionNumber: number
  instructionTotal: number
  showTranslation: boolean
  last: boolean
  onNext: () => void
}) {
  const { t } = useI18n()
  const directionLabel = useDirectionLabels()
  const { solved, select, optionState, selectedId } = useMcqAnswer(instruction.action)
  const actions = ["straight", "right", "left", "stop", "arrive"] as const

  return (
    <div className="space-y-4">
      <MiniMap highlight={solved ? instruction.action : undefined} />
      <p className="text-sm text-muted-foreground">{prompt}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Instruction {instructionNumber} of {instructionTotal}
      </p>
      {instruction.audioId ? (
        <div className="flex justify-center py-0.5">
          <PlayAudioButton
            packId={packId}
            clipId={instruction.audioId}
            size="icon"
            variant="secondary"
            label={t("play.listen")}
          />
        </div>
      ) : null}
      {selectedId ? <p className="arabic-text text-center text-3xl leading-relaxed">{instruction.arabic}</p> : null}
      {showTranslation ? <p className="text-center text-sm text-muted-foreground">{instruction.meaning}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <OptionButton
            key={action}
            state={optionState(action)}
            disabled={solved}
            onClick={() => select(action)}
          >
            {directionLabel[action]}
          </OptionButton>
        ))}
      </div>
      <Button className="w-full" disabled={!solved} onClick={onNext}>
        {last ? t("play.arrive") : t("play.nextInstruction")}
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
  lessonCompleted = false,
  returnTo,
  onReplay,
}: {
  experienceId?: string
  title?: string
  outcome: string
  canNowDo: string
  vocabIds: string[]
  advanced?: boolean
  kind: "mission" | "lesson"
  capabilityId?: string
  lessonCompleted?: boolean
  returnTo?: string
  onReplay: () => void
}) {
  const { resetTabToRoot } = useTabNavigation()
  const { setLessonCompleted } = useAppState()
  const { t, capability: capabilityCopy } = useI18n()
  const capability = capabilityId ? getCapability(capabilityId as "navigation") : undefined
  const localizedCapability = capabilityId ? capabilityCopy(capabilityId) : undefined
  const words = vocabIds.map((id) => getLearningWord(id)).filter(Boolean)
  const isStudy = kind === "lesson"
  const isMission = kind === "mission"

  return (
    <div className="space-y-5 pb-10">
      <MissionCelebration active={isMission} />
      <BackButton to={returnTo} />
      {!isStudy && experienceId ? (
        <ExperienceScene scene={sceneForExperience(experienceId)} missionId={experienceId} className="h-36" />
      ) : null}
      <header className={isStudy ? "rounded-[1.75rem] bg-sky/10 p-5" : "rounded-[1.75rem] bg-sage/10 p-5 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500"}>
        <p
          className={
            isStudy
              ? "text-[11px] font-semibold tracking-[0.18em] text-sky-deep uppercase"
              : "text-[11px] font-semibold tracking-[0.18em] text-sage-deep uppercase"
          }
        >
          {isStudy ? t("play.studyComplete") : t("play.missionComplete")}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{outcome}</h1>
        {advanced ? (
          <p className="mt-2 text-sm text-sage-deep">{t("mission.richerVocab")}</p>
        ) : null}
      </header>

      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {isStudy ? t("play.youStudied") : t("play.youCanNow")}
        </p>
        <p className="mt-2 text-base leading-relaxed">{canNowDo}</p>
        {capability ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {localizedCapability?.title ?? capability.title} · {isStudy ? t("play.study") : t("play.mission")}
          </p>
        ) : null}
      </section>

      <section>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {isStudy ? t("play.wordsInLesson") : t("play.wordsUsed")}
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
          {isStudy
            ? returnTo
              ? returnTo.startsWith("/study")
                ? t("play.backToStudy")
                : t("play.backToMission")
              : t("common.backToMap")
            : t("common.backToMap")}
        </Link>
      )}
      <Button variant="outline" className="w-full" onClick={onReplay}>
        {isStudy ? t("play.studyAgain") : t("common.playAgain")}
      </Button>
      {isStudy && experienceId && lessonCompleted ? (
        <button
          type="button"
          className="w-full text-center text-sm font-semibold text-muted-foreground"
          onClick={() => setLessonCompleted(experienceId, false)}
        >
          {t("study.markIncomplete")}
        </button>
      ) : null}
    </div>
  )
}
