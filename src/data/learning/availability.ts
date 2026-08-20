import { getMission } from "@/data/learning/missions"
import { getLesson } from "@/data/learning/lessons"
import { isLessonReleased, isMissionReleased, isNodeUnlocked, type MissionNode } from "@/data/learning/mission-graph"

/** Shared availability for missions and study lessons. */
export type ContentAvailability = "done" | "open" | "locked" | "coming-soon"

export function isLessonImplemented(id: string) {
  const lesson = getLesson(id)
  if (!lesson) return false
  return isLessonReleased(id) && lesson.playable && Boolean(lesson.buildRun)
}

export function isMissionImplemented(id: string) {
  const mission = getMission(id)
  if (!mission) return false
  return isMissionReleased(id) && mission.playable
}

export function lessonAvailability(lessonId: string): ContentAvailability {
  if (!isLessonImplemented(lessonId)) return "coming-soon"
  return "open"
}

export function missionAvailability(
  id: string,
  completedIds: string[],
  node?: MissionNode,
): ContentAvailability {
  if (completedIds.includes(id)) return "done"
  if (!isMissionImplemented(id)) return "coming-soon"
  if (node && !isNodeUnlocked(node, completedIds)) return "locked"
  return "open"
}

export function availabilityLabelKey(availability: ContentAvailability) {
  if (availability === "done") return "common.done"
  if (availability === "open") return "common.open"
  if (availability === "locked") return "common.locked"
  return "journeys.statusComingSoon"
}

export function canOpenMissionPlace(id: string) {
  return isMissionImplemented(id)
}
