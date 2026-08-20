import type { StudyGroup } from "@/lib/learning-types"
import type { VocabBookmark } from "@/lib/bookmarks"
import { createRunById } from "@/lib/mission-engine"
import { getLesson, lessons } from "@/data/learning/lessons"

export function getStudyGroups(lessonId: string) {
  const lesson = getLesson(lessonId)
  if (!lesson?.buildRun) return null
  try {
    const bundle = createRunById(lessonId, {}, `bookmark-${lessonId}`)
    const study = bundle.run.steps.find((step) => step.type === "study")
    if (!study || study.type !== "study") return null
    return study.groups
  } catch {
    return null
  }
}

export type StudyBookmarkSection = {
  lessonId: string
  title: string
  groups: StudyGroup[]
  /** Word ids in this lesson that were bookmarked when the page opened. */
  bookmarkIds: string[]
}

/** Lessons that contain at least one initially bookmarked word from that lesson. */
export function getStudyBookmarkSections(bookmarks: VocabBookmark[]): StudyBookmarkSection[] {
  return lessons.flatMap((lesson) => {
    const groups = getStudyGroups(lesson.id)
    if (!groups) return []
    const bookmarkIds = bookmarks.filter((item) => item.lessonId === lesson.id).map((item) => item.wordId)
    if (bookmarkIds.length === 0) return []
    return [{ lessonId: lesson.id, title: lesson.title, groups, bookmarkIds }]
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
