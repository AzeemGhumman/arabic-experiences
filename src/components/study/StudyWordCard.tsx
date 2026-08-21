import { RegisterBadge } from "@/components/mission/MissionBits"
import { PlayAudioButton } from "@/components/audio/PlayAudioButton"
import { BookmarkButton } from "@/components/vocabulary/BookmarkButton"
import { getLearningWord } from "@/data/learning/words"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function StudyWordCard({
  wordId,
  packId,
  bookmarked,
  pendingRemoval,
  onToggleBookmark,
  showAudio = true,
  className,
  compact,
}: {
  wordId: string
  packId: string
  bookmarked: boolean
  pendingRemoval?: boolean
  onToggleBookmark?: (id: string) => void
  showAudio?: boolean
  className?: string
  compact?: boolean
}) {
  const { word: gloss, language } = useI18n()
  const word = getLearningWord(wordId)
  if (!word) return null
  const meaning = gloss(wordId, word.meaning)
  const showTransliteration = language === "en" && Boolean(word.transliteration)

  if (compact) {
    return (
      <article
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card",
          pendingRemoval && "bg-muted/30 opacity-70",
          className,
        )}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-ink">{meaning}</p>
          <div className="min-w-0 shrink-0 text-right">
            <p className="arabic-text text-xl leading-none" dir="rtl">
              {word.arabic}
            </p>
            {showTransliteration ? (
              <p className="mt-1 text-[11px] italic leading-snug text-ink-soft">
                {word.transliteration}
              </p>
            ) : null}
          </div>
          {showAudio ? <PlayAudioButton packId={packId} clipId={wordId} variant="ghost" /> : null}
          {onToggleBookmark ? (
            <BookmarkButton bookmarked={bookmarked} onToggle={() => onToggleBookmark(wordId)} />
          ) : null}
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        pendingRemoval && "bg-muted/30 opacity-70",
        className,
      )}
    >
      <div className="grid grid-cols-2">
        <div className="flex min-w-0 flex-col justify-center gap-1 border-e border-border px-3 py-3">
          <p className="text-sm font-medium leading-snug text-ink">{meaning}</p>
          <RegisterBadge register={word.register} />
        </div>
        <div className="flex min-w-0 items-start gap-1 px-3 py-3">
          <div className="min-w-0 flex-1 text-right">
            <p className="arabic-text text-2xl leading-none" dir="rtl">
              {word.arabic}
            </p>
            {showTransliteration ? (
              <p className="mt-1 text-[11px] italic leading-snug text-ink-soft">
                {word.transliteration}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
            {showAudio ? <PlayAudioButton packId={packId} clipId={wordId} variant="ghost" /> : null}
            {onToggleBookmark ? (
              <BookmarkButton bookmarked={bookmarked} onToggle={() => onToggleBookmark(wordId)} />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

export function StudyWordTile({
  wordId,
  packId,
  bookmarked,
  onToggleBookmark,
  showAudio = true,
  swatch,
  className,
}: {
  wordId: string
  packId: string
  bookmarked: boolean
  onToggleBookmark?: (id: string) => void
  showAudio?: boolean
  swatch?: string
  className?: string
}) {
  const { word: gloss, language } = useI18n()
  const word = getLearningWord(wordId)
  if (!word) return null
  const meaning = gloss(wordId, word.meaning)
  const showTransliteration = language === "en" && Boolean(word.transliteration)

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-3",
        swatch && "border-2",
        className,
      )}
      style={swatch ? { borderColor: swatch, backgroundColor: `${swatch}18` } : undefined}
    >
      {swatch ? (
        <span
          className="mb-2 h-6 w-full rounded-lg border border-border/50"
          style={{ backgroundColor: swatch }}
        />
      ) : null}
      <p className="arabic-text text-2xl leading-none" dir="rtl">
        {word.arabic}
      </p>
      <p className="mt-1.5 text-sm font-medium text-ink">{meaning}</p>
      {showTransliteration ? (
        <p className="text-[11px] italic text-ink-soft">{word.transliteration}</p>
      ) : null}
      <div className="mt-auto flex items-center justify-end gap-1 pt-2">
        {showAudio ? <PlayAudioButton packId={packId} clipId={wordId} variant="ghost" /> : null}
        {onToggleBookmark ? (
          <BookmarkButton bookmarked={bookmarked} onToggle={() => onToggleBookmark(wordId)} />
        ) : null}
      </div>
    </article>
  )
}
