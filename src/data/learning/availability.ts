import { getMission } from "@/data/learning/missions"
import { getLesson } from "@/data/learning/lessons"
import {
  isLessonReleased,
  isMissionReleased,
  isMissionPlayable,
  isNodeUnlocked,
  type MissionNode,
} from "@/data/learning/mission-graph"
import { areMissionPrerequisitesMet } from "@/data/learning/mission-prerequisites"

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
  const locked = node ? !isNodeUnlocked(node, completedIds) : false
  if (!isMissionImplemented(id)) return locked ? "locked" : "coming-soon"
  if (locked) return "locked"
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

/** Map is unlocked, mission is playable, and linked study lessons are done. */
export function canStartMission(
  missionId: string,
  completedMissionIds: string[],
  completedLessonIds: string[],
  node?: MissionNode,
) {
  const availability = missionAvailability(missionId, completedMissionIds, node)
  if (availability !== "open" && availability !== "done") return false
  if (!isMissionPlayable(missionId)) return false
  if (availability === "done") return true
  return areMissionPrerequisitesMet(missionId, completedLessonIds)
}
