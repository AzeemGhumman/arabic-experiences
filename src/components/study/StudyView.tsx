import type { StudyPresentationProps } from "@/components/study/presentations/types"
import { VocabListPresentation } from "@/components/study/presentations/VocabListPresentation"

/** Shared study list for every lesson. Alternate layouts can be added later. */
export function StudyView(props: StudyPresentationProps) {
  return <VocabListPresentation {...props} />
}
