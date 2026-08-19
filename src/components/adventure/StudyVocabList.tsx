import { ExperienceScene } from "@/components/adventure/ExperienceScenes"
import { RegisterBadge } from "@/components/adventure/AdventureBits"
import { PlayAudioButton } from "@/components/audio/PlayAudioButton"
import { BookmarkButton } from "@/components/vocabulary/BookmarkButton"
import { getLearningWord } from "@/data/learning/words"
import type { StudyGroup } from "@/lib/learning-types"
import { cn } from "@/lib/utils"

export function StudyVocabList({
  packId,
  groups,
  isBookmarked,
  isPendingRemoval,
  onToggleBookmark,
  showAudio = true,
}: {
  packId: string
  groups: StudyGroup[]
  isBookmarked: (id: string) => boolean
  isPendingRemoval?: (id: string) => boolean
  onToggleBookmark: (id: string) => void
  showAudio?: boolean
}) {
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
              const pending = isPendingRemoval?.(id) ?? false
              return (
                <article
                  key={id}
                  className={cn(
                    index > 0 ? "grid grid-cols-2 border-t border-border" : "grid grid-cols-2",
                    pending && "bg-muted/30 opacity-70",
                  )}
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
                  <div className="flex min-w-0 items-center justify-end gap-1 px-3 py-3.5">
                    <p className="arabic-text text-2xl leading-none" dir="rtl">
                      {word.arabic}
                    </p>
                    {showAudio ? <PlayAudioButton packId={packId} clipId={id} variant="ghost" /> : null}
                    <BookmarkButton
                      bookmarked={isBookmarked(id)}
                      onToggle={() => onToggleBookmark(id)}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
