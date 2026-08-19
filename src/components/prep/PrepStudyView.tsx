import type { PrepStudyPresentationProps } from "@/components/prep/presentations/types"
import { VocabListPresentation } from "@/components/prep/presentations/VocabListPresentation"

/** Shared study list for every prep session. Alternate layouts can be added later. */
export function PrepStudyView({
  sessionId: _sessionId,
  ...props
}: PrepStudyPresentationProps & { sessionId: string }) {
  return <VocabListPresentation {...props} />
}
