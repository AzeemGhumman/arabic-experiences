import { VocabListPresentation } from "@/components/study/presentations/VocabListPresentation"
import type { StudyGroup } from "@/lib/learning-types"

/** Default list layout — used for bookmarks and fallback. */
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
    <VocabListPresentation
      packId={packId}
      groups={groups}
      isBookmarked={isBookmarked}
      isPendingRemoval={isPendingRemoval}
      onToggleBookmark={onToggleBookmark}
      showAudio={showAudio}
    />
  )
}
