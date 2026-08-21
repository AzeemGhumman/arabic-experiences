import { StudyGroupHeader } from "@/components/study/StudyGroupHeader"
import { StudyWordCard } from "@/components/study/StudyWordCard"
import type { StudyPresentationProps } from "@/components/study/presentations/types"

export function VocabListPresentation({
  packId,
  groups,
  isBookmarked,
  isPendingRemoval,
  onToggleBookmark,
  showAudio,
}: StudyPresentationProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.copyKey ?? group.title} className="space-y-3">
          <StudyGroupHeader lessonId={packId} group={group} />
          <div className="space-y-2">
            {group.vocabIds.map((id) => (
              <StudyWordCard
                key={id}
                wordId={id}
                packId={packId}
                bookmarked={isBookmarked(id)}
                pendingRemoval={isPendingRemoval?.(id)}
                onToggleBookmark={onToggleBookmark}
                showAudio={showAudio}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
