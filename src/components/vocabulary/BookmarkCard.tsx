import { getLearningWord } from "@/data/learning/words"
import { BookmarkButton } from "@/components/vocabulary/BookmarkButton"
import { RegisterBadge } from "@/components/adventure/AdventureBits"
import { useI18n } from "@/lib/i18n"

/** Room for images, video, or audio attachments as bookmarks grow beyond plain words. */
export function BookmarkCard({
  wordId,
  onToggle,
}: {
  wordId: string
  onToggle: () => void
}) {
  const { word } = useI18n()
  const item = getLearningWord(wordId)
  if (!item) return null

  return (
    <article className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="arabic-text text-3xl leading-none" dir="rtl">
            {item.arabic}
          </p>
          <p className="mt-2 text-base font-medium leading-snug">{word(item.id, item.meaning)}</p>
          {item.transliteration ? (
            <p className="mt-1 text-sm italic text-ink-soft">{item.transliteration}</p>
          ) : null}
          {item.register ? (
            <div className="mt-2">
              <RegisterBadge register={item.register} />
            </div>
          ) : null}
        </div>
        <BookmarkButton bookmarked onToggle={onToggle} />
      </div>
    </article>
  )
}
