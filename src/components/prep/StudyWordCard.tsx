import { RegisterBadge } from "@/components/adventure/AdventureBits"
import { PlayAudioButton } from "@/components/audio/PlayAudioButton"
import { BookmarkButton } from "@/components/vocabulary/BookmarkButton"
import { getLearningWord } from "@/data/learning/words"
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
  const word = getLearningWord(wordId)
  if (!word) return null

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
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug text-ink">{word.meaning}</p>
            {word.transliteration ? (
              <p className="mt-0.5 text-[11px] italic leading-snug text-ink-soft">{word.transliteration}</p>
            ) : null}
          </div>
          <p className="arabic-text shrink-0 text-xl leading-none" dir="rtl">
            {word.arabic}
          </p>
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
        <div className="flex min-w-0 flex-col justify-center border-r border-border px-3 py-3">
          <p className="text-sm font-medium text-ink">{word.meaning}</p>
          {word.transliteration ? (
            <p className="mt-0.5 text-[11px] italic text-ink-soft">{word.transliteration}</p>
          ) : null}
          <div className="mt-1">
            <RegisterBadge register={word.register} />
          </div>
        </div>
        <div className="flex min-w-0 items-center justify-end gap-1 px-2 py-3">
          <p className="arabic-text text-2xl leading-none" dir="rtl">
            {word.arabic}
          </p>
          {showAudio ? <PlayAudioButton packId={packId} clipId={wordId} variant="ghost" /> : null}
          {onToggleBookmark ? (
            <BookmarkButton bookmarked={bookmarked} onToggle={() => onToggleBookmark(wordId)} />
          ) : null}
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
  const word = getLearningWord(wordId)
  if (!word) return null

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
      <p className="mt-1.5 text-sm font-medium text-ink">{word.meaning}</p>
      <p className="text-[11px] italic text-ink-soft">{word.transliteration}</p>
      <div className="mt-auto flex items-center justify-end gap-1 pt-2">
        {showAudio ? <PlayAudioButton packId={packId} clipId={wordId} variant="ghost" /> : null}
        {onToggleBookmark ? (
          <BookmarkButton bookmarked={bookmarked} onToggle={() => onToggleBookmark(wordId)} />
        ) : null}
      </div>
    </article>
  )
}
