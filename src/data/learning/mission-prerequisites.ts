import { isLessonImplemented } from "@/data/learning/availability"
import { getLesson } from "@/data/learning/lessons"
import { getMission } from "@/data/learning/missions"
import type { Lesson } from "@/lib/learning-types"

/** Implemented study lessons listed on the mission (`Mission.lessonIds`). */
export function getMissionPrerequisiteLessons(missionId: string): Lesson[] {
  const mission = getMission(missionId)
  if (!mission?.lessonIds.length) return []
  return mission.lessonIds
    .map((id) => getLesson(id))
    .filter((lesson): lesson is Lesson => Boolean(lesson && isLessonImplemented(lesson.id)))
    .sort((a, b) => a.level - b.level)
}

export function getIncompleteMissionPrerequisites(missionId: string, completedLessonIds: string[]) {
  return getMissionPrerequisiteLessons(missionId).filter((lesson) => !completedLessonIds.includes(lesson.id))
}

export function areMissionPrerequisitesMet(missionId: string, completedLessonIds: string[]) {
  return getIncompleteMissionPrerequisites(missionId, completedLessonIds).length === 0
}

export function missionPrerequisiteProgress(missionId: string, completedLessonIds: string[]) {
  const required = getMissionPrerequisiteLessons(missionId)
  const done = required.filter((lesson) => completedLessonIds.includes(lesson.id)).length
  return { done, total: required.length }
}

export function isLessonOpened(lessonId: string, openedLessonIds: string[]) {
  return openedLessonIds.includes(lessonId)
}
