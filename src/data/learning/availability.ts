import { getAdventure } from "@/data/learning/adventures"
import { getSideMission } from "@/data/learning/side-missions"
import { isMissionReleased, isNodeUnlocked, type MissionNode } from "@/data/learning/mission-graph"

/** Shared availability for missions and prep sessions. */
export type ContentAvailability = "done" | "open" | "locked" | "coming-soon"

export function isPrepImplemented(id: string) {
  const session = getSideMission(id)
  if (!session) return false
  return isMissionReleased(id) && session.playable && Boolean(session.buildRun)
}

export function isMissionImplemented(id: string) {
  const adventure = getAdventure(id)
  const side = getSideMission(id)
  if (side) return isPrepImplemented(id)
  if (!adventure) return false
  return isMissionReleased(id) && adventure.playable
}

export function prepAvailability(sessionId: string): ContentAvailability {
  if (!isPrepImplemented(sessionId)) return "coming-soon"
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
