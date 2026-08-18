import { getSideMission } from "@/data/learning/side-missions"
import { isMissionReleased } from "@/data/learning/mission-graph"
import missionPracticeMap from "@/data/learning/mission-practices.json"

export type MissionPractice = {
  id: string
  title: string
  description: string
  playable: boolean
  minutes?: number
}

/** Side practices attached to a mission. Sourced from mission-practices.json (1-to-many). */
export function getPracticesForMission(missionId: string): MissionPractice[] {
  const ids: string[] = (missionPracticeMap as Record<string, string[]>)[missionId] ?? []
  return ids.flatMap((id) => {
    const session = getSideMission(id)
    if (!session || !isMissionReleased(id)) return []
    return [
      {
        id: session.id,
        title: session.title,
        description: session.description,
        playable: session.playable,
        minutes: session.estimatedMinutes,
      },
    ]
  })
}
