import { StudyGroupHeader } from "@/components/prep/StudyGroupHeader"
import { StudyWordCard } from "@/components/prep/StudyWordCard"
import type { PrepStudyPresentationProps } from "@/components/prep/presentations/types"

export function VocabListPresentation({
  packId,
  groups,
  isBookmarked,
  isPendingRemoval,
  onToggleBookmark,
  showAudio,
}: PrepStudyPresentationProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.title} className="space-y-3">
          <StudyGroupHeader group={group} />
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
