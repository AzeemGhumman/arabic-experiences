import {
  MissionAudioHints,
  McqAudioOption,
  OptionsArabicHintButton,
  PlayAllButton,
  usePlayAllOptions,
} from "@/components/mission/MissionAudioHints"
import { OptionButton, useMcqAnswer, useMcqArabicHints, useShuffledOptions } from "@/components/mission/MissionBits"
import { Button } from "@/components/ui/button"
import { vocabItemImage } from "@/data/learning/vocab-item-images"
import { useI18n } from "@/lib/i18n"
import type { ChoiceOption } from "@/lib/learning-types"

export function OfficerPromptStep({
  packId,
  prompt,
  audioTranslation,
  officerArabic,
  audioId,
  question,
  options,
  correctId,
  feedback,
  onContinue,
}: {
  packId: string
  prompt: string
  audioTranslation?: string
  officerArabic?: string
  audioId: string
  question?: string
  options: ChoiceOption[]
  correctId: string
  feedback?: string
  onContinue: () => void
}) {
  const { t } = useI18n()
  const shuffledOptions = useShuffledOptions(options)
  const questionText = question ?? t("play.howWouldYouRespond")
  const audioResponses = shuffledOptions.every((option) => option.audioId && option.arabic)
  const seq = usePlayAllOptions(packId, shuffledOptions)

  const plainMcq = useMcqAnswer(correctId)
  const audioMcq = useMcqArabicHints(correctId)
  const { solved, select, optionState, selectedId, hintRevealed, revealHint, showArabicForOption } = audioResponses
    ? audioMcq
    : { ...plainMcq, hintRevealed: false, revealHint: () => {}, showArabicForOption: () => true }

  return (
    <div className="space-y-3">
      <MissionAudioHints
        prompt={prompt}
        packId={packId}
        utterances={[{ audioId, arabic: officerArabic, translation: audioTranslation }]}
      />

      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 flex-1 text-sm font-medium text-ink">{questionText}</p>
        {audioResponses ? (
          <div className="flex shrink-0 items-center gap-1.5">
            {!hintRevealed && !solved ? (
              <OptionsArabicHintButton onReveal={revealHint} />
            ) : null}
            <PlayAllButton
              onPlay={() => void seq.playAll()}
              onStop={seq.stop}
              isSequencing={seq.isSequencing}
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-2">
        {audioResponses
          ? shuffledOptions.map((option) => (
              <McqAudioOption
                key={option.id}
                packId={packId}
                audioId={option.audioId!}
                arabic={option.arabic}
                imageSrc={vocabItemImage(option.id)}
                imageAlt={option.label}
                showArabic={showArabicForOption(option.id)}
                state={optionState(option.id)}
                disabled={solved}
                audioDisabled={seq.isSequencing}
                highlighted={seq.highlightedOptionId === option.id}
                onSelect={() => select(option.id)}
              />
            ))
          : shuffledOptions.map((option) => (
              <OptionButton
                key={option.id}
                state={optionState(option.id)}
                disabled={solved}
                onClick={() => select(option.id)}
              >
                {option.arabic ? (
                  <span className="arabic-text block text-xl leading-relaxed">{option.arabic}</span>
                ) : (
                  <span className="block">{option.label}</span>
                )}
              </OptionButton>
            ))}
      </div>

      {solved && feedback ? (
        <p className="rounded-2xl bg-sage/10 px-4 py-3 text-sm leading-relaxed text-sage-deep">{feedback}</p>
      ) : null}
      {!solved && selectedId ? (
        <p className="text-sm text-muted-foreground">{t("play.tryAnother")}</p>
      ) : null}

      <Button className="w-full" variant="terracotta" disabled={!solved} onClick={onContinue}>
        {t("play.continue")}
      </Button>
    </div>
  )
}
