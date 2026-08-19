import type { StudyGroup } from "@/lib/learning-types"

export type PrepStudyPresentationProps = {
  packId: string
  groups: StudyGroup[]
  isBookmarked: (id: string) => boolean
  isPendingRemoval?: (id: string) => boolean
  onToggleBookmark?: (id: string) => void
  showAudio?: boolean
}
