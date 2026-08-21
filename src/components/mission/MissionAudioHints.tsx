import { useState, useCallback, useRef, type MouseEvent, type ReactNode } from "react"
import { Volume2, ListMusic } from "lucide-react"
import { PlayAudioButton } from "@/components/audio/PlayAudioButton"
import { Button } from "@/components/ui/button"
import { useAudioPack } from "@/lib/audio/use-audio-pack"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { ChoiceOption } from "@/lib/learning-types"
import type { OptionVisualState } from "@/components/mission/MissionBits"

/** One spoken line — supports multi-speaker dialogue. */
export type MissionUtterance = {
  audioId: string
  arabic?: string
  /** Meaning in the learner's interface language. */
  translation?: string
}

function stopBubble(event: MouseEvent) {
  event.stopPropagation()
}

/** Audio row + independent Arabic / translation hint toggles for officer prompts. */
export function MissionAudioBlock({
  packId,
  utterances,
  className,
}: {
  packId: string
  utterances: MissionUtterance[]
  className?: string
}) {
  const { t, pack } = useI18n()
  const [showArabic, setShowArabic] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const hasArabic = utterances.some((line) => line.arabic)
  const hasTranslation = utterances.some((line) => line.translation)
  const expanded = showArabic || showTranslation
  const translationHint = t("play.showTranslationHint", { language: pack.meta.name })

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1" onClick={stopBubble}>
        {utterances.map((line, index) => (
          <PlayAudioButton
            key={`${line.audioId}-${index}`}
            packId={packId}
            clipId={line.audioId}
            size="inline"
            variant="secondary"
            label={t("play.listen")}
          />
        ))}
        {hasArabic && !showArabic ? (
          <>
            <span className="text-muted-foreground/40" aria-hidden>·</span>
            <HintRevealButton onClick={() => setShowArabic(true)}>
              {t("play.showArabicHint")}
            </HintRevealButton>
          </>
        ) : null}
        {hasTranslation && !showTranslation ? (
          <>
            <span className="text-muted-foreground/40" aria-hidden>·</span>
            <HintRevealButton onClick={() => setShowTranslation(true)}>
              {translationHint}
            </HintRevealButton>
          </>
        ) : null}
      </div>

      {expanded ? (
        <div className="mt-2 space-y-2 rounded-xl border border-border/50 bg-paper/70 p-2" onClick={stopBubble}>
          {utterances.map((line, index) => (
            <UtteranceHints
              key={`${line.audioId}-${index}`}
              line={line}
              showArabic={showArabic}
              showTranslation={showTranslation}
              divided={index > 0}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** Scene line with audio + hint controls on a fixed second row. */
export function MissionAudioHints({
  prompt,
  packId,
  utterances,
  className,
}: {
  prompt: string
  packId: string
  utterances: MissionUtterance[]
  className?: string
}) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-secondary/35 px-3 py-2.5", className)}>
      <p className="text-sm font-medium leading-snug text-ink">{prompt}</p>
      <div className="mt-1.5">
        <MissionAudioBlock packId={packId} utterances={utterances} />
      </div>
    </div>
  )
}

function HintRevealButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-full px-2 py-0.5 text-xs font-semibold text-sky-deep transition hover:bg-sky/10"
      onClick={(event) => { event.stopPropagation(); onClick() }}
    >
      {children}
    </button>
  )
}

function MissionArabicLine({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p dir="rtl" className={cn("font-arabic arabic-text text-lg leading-snug text-ink", className)}>
      {children}
    </p>
  )
}

function UtteranceHints({
  line,
  showArabic,
  showTranslation,
  divided,
}: {
  line: MissionUtterance
  showArabic: boolean
  showTranslation: boolean
  divided: boolean
}) {
  if (!(showArabic && line.arabic) && !(showTranslation && line.translation)) return null
  return (
    <div className={cn("space-y-1", divided && "border-t border-border/40 pt-2")}>
      {showArabic && line.arabic ? (
        <div dir="rtl" className="rounded-lg bg-secondary/40 px-2 py-1.5 text-right">
          <MissionArabicLine>{line.arabic}</MissionArabicLine>
        </div>
      ) : null}
      {showTranslation && line.translation ? (
        <div dir="ltr" className="rounded-lg bg-secondary/25 px-2 py-1 text-left">
          <p className="text-xs leading-snug text-muted-foreground">{line.translation}</p>
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Audio MCQ options — compact cards with a "Listen to all" sequencer
// ---------------------------------------------------------------------------

/** Fixed-width masking tape — same size on every option while Arabic is hidden. */
function ArabicHiddenTape() {
  return (
    <div className="flex w-full items-center justify-end pe-0.5" aria-hidden>
      <div className="relative h-9 w-40 shrink-0 -rotate-2">
        <div className="arabic-hidden-tape absolute inset-0 rounded-[3px] ring-1 ring-ink/10" />
        <div className="absolute inset-x-3 top-[38%] h-px bg-ink/8" />
        <div className="absolute inset-x-5 top-[62%] h-px bg-ink/5" />
      </div>
    </div>
  )
}

/** Compact MCQ option: left strip plays audio, right area selects the answer. */
export function McqAudioOption({
  packId,
  audioId,
  arabic,
  imageSrc,
  imageAlt,
  showArabic = true,
  state,
  disabled,
  audioDisabled,
  highlighted,
  onSelect,
}: {
  packId: string
  audioId: string
  arabic?: string
  /** When set, the option is chosen by picture; Arabic is a reveal label. */
  imageSrc?: string
  imageAlt?: string
  /** When false, the answer area stays blank until a hint or reveal rule shows it. */
  showArabic?: boolean
  state: OptionVisualState
  disabled?: boolean
  /** Disable only the speaker button (used while sequencing). */
  audioDisabled?: boolean
  /** True while this option is being played by the sequencer. */
  highlighted?: boolean
  onSelect: () => void
}) {
  const { t } = useI18n()
  const pictureChoice = Boolean(imageSrc)

  const answerBody = pictureChoice ? (
    <div className="flex w-full items-center gap-3">
      <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-secondary/35 sm:size-[4.5rem]">
        <img src={imageSrc} alt={imageAlt ?? ""} className="size-full object-cover" draggable={false} />
      </div>
      <div className="min-w-0 flex-1">
        {arabic && showArabic ? (
          <MissionArabicLine className="w-full">{arabic}</MissionArabicLine>
        ) : (
          <span className="sr-only">{t("play.hiddenArabicOption")}</span>
        )}
      </div>
    </div>
  ) : (
    <>
      {arabic && showArabic ? (
        <MissionArabicLine className="w-full">{arabic}</MissionArabicLine>
      ) : null}
      {arabic && !showArabic ? (
        <>
          <ArabicHiddenTape />
          <span className="sr-only">{t("play.hiddenArabicOption")}</span>
        </>
      ) : null}
    </>
  )

  return (
    <div className="relative">
      {highlighted ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1.5 rounded-[1.125rem] border-2 border-dashed border-sky-deep/75"
        />
      ) : null}
      <div
        className={cn(
          "flex items-stretch rounded-2xl border text-start transition-colors",
          state === "correct"
            ? "border-sage-deep bg-sage/35"
            : state === "wrong"
              ? "border-destructive/40 bg-destructive/10"
              : "border-border bg-paper",
          disabled && state === "idle" && !showArabic && !pictureChoice && "opacity-60",
        )}
      >
        <PlayAudioButton
          packId={packId}
          clipId={audioId}
          size="zone"
          label={t("play.listen")}
          disabled={audioDisabled}
          className={cn(
            "rounded-s-2xl",
            state === "correct" && "border-sage-deep/30 bg-sage/20",
            state === "wrong" && "border-destructive/20 bg-destructive/5",
          )}
        />

      {disabled ? (
        <div
          className={cn(
            "relative flex min-w-0 flex-1 items-center rounded-r-2xl px-3",
            pictureChoice ? "min-h-[4.75rem] py-2" : "min-h-11 py-2.5",
          )}
        >
          {answerBody}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              onSelect()
            }
          }}
          className={cn(
            "relative flex min-w-0 flex-1 cursor-pointer items-center rounded-r-2xl px-3 hover:bg-secondary/25",
            pictureChoice ? "min-h-[4.75rem] py-2" : "min-h-11 py-2.5",
          )}
        >
          {answerBody}
        </div>
      )}
      </div>
    </div>
  )
}

/** "Listen to all" button + sequencer that plays each option and highlights it. */
export function usePlayAllOptions(packId: string, options: ChoiceOption[]) {
  const { play, playingId } = useAudioPack(packId)
  const [sequencingIndex, setSequencingIndex] = useState<number | null>(null)
  const cancelledRef = useRef(false)

  const playAll = useCallback(async () => {
    cancelledRef.current = false
    for (let i = 0; i < options.length; i++) {
      if (cancelledRef.current) break
      const option = options[i]
      if (!option.audioId) continue
      setSequencingIndex(i)
      await play(option.audioId)
      if (cancelledRef.current) break
      // small gap between clips
      await new Promise((resolve) => setTimeout(resolve, 350))
    }
    setSequencingIndex(null)
  }, [options, play])

  const stop = useCallback(() => {
    cancelledRef.current = true
    setSequencingIndex(null)
  }, [])

  const highlightedOptionId = sequencingIndex !== null ? options[sequencingIndex]?.id ?? null : null

  return { playAll, stop, playingId, highlightedOptionId, isSequencing: sequencingIndex !== null }
}

export function OptionsArabicHintButton({ onReveal }: { onReveal: () => void }) {
  const { t } = useI18n()
  return (
    <Button type="button" variant="secondary" size="sm" className="text-sky-deep" onClick={onReveal}>
      <span className="text-xs">{t("play.showArabicHint")}</span>
    </Button>
  )
}

export function PlayAllButton({
  onPlay,
  onStop,
  isSequencing,
}: {
  onPlay: () => void
  onStop: () => void
  isSequencing: boolean
}) {
  const { t } = useI18n()
  return (
    <Button
      type="button"
      variant={isSequencing ? "terracotta" : "secondary"}
      size="sm"
      className="gap-1.5"
      onClick={(event) => {
        event.stopPropagation()
        if (isSequencing) onStop()
        else onPlay()
      }}
    >
      {isSequencing ? (
        <>
          <Volume2 className="size-3.5 animate-pulse" />
          <span className="text-xs">{t("play.playing")}</span>
        </>
      ) : (
        <>
          <ListMusic className="size-3.5" />
          <span className="text-xs">{t("play.listenToOptions")}</span>
        </>
      )}
    </Button>
  )
}
