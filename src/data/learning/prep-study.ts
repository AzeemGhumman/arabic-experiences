import type { StudyGroup } from "@/lib/learning-types"
import type { VocabBookmark } from "@/lib/bookmarks"
import { createRunById } from "@/lib/adventure-engine"
import { sideMissions, getSideMission } from "@/data/learning/side-missions"

export function getPrepStudyGroups(sessionId: string) {
  const session = getSideMission(sessionId)
  if (!session?.buildRun) return null
  try {
    const bundle = createRunById(sessionId, {}, `bookmark-${sessionId}`)
    const study = bundle.run.steps.find((step) => step.type === "study")
    if (!study || study.type !== "study") return null
    return study.groups
  } catch {
    return null
  }
}

export type PrepBookmarkSection = {
  sessionId: string
  title: string
  groups: StudyGroup[]
  /** Word ids in this session that were bookmarked when the page opened. */
  bookmarkIds: string[]
}

/** Prep sessions that contain at least one initially bookmarked word from that session. */
export function getPrepBookmarkSections(bookmarks: VocabBookmark[]): PrepBookmarkSection[] {
  return sideMissions.flatMap((session) => {
    const groups = getPrepStudyGroups(session.id)
    if (!groups) return []
    const bookmarkIds = bookmarks.filter((item) => item.sessionId === session.id).map((item) => item.wordId)
    if (bookmarkIds.length === 0) return []
    return [{ sessionId: session.id, title: session.title, groups, bookmarkIds }]
  })
}

/** Groups with only the given vocab ids, preserving study order. */
export function filterStudyGroups(groups: StudyGroup[], visibleIds: Set<string>) {
  return groups
    .map((group) => ({
      ...group,
      vocabIds: group.vocabIds.filter((id) => visibleIds.has(id)),
    }))
    .filter((group) => group.vocabIds.length > 0)
}

/** Count staged bookmark changes vs the snapshot taken when the page opened. */
export function bookmarkChangeCount(initial: Set<string>, staged: Set<string>) {
  let count = 0
  for (const id of initial) if (!staged.has(id)) count += 1
  for (const id of staged) if (!initial.has(id)) count += 1
  return count
}
