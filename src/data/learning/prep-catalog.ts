import { isPrepImplemented } from "@/data/learning/availability"
import { prepTopics } from "@/data/learning/prep-topics"
import { getSideMission, sideMissions } from "@/data/learning/side-missions"
import type { PrepTopic, PrepTopicId, SideMission } from "@/lib/learning-types"

export type PrepCatalogSession = {
  session: SideMission
  implemented: boolean
  completed: boolean
}

export type PrepCatalogTopic = {
  topic: PrepTopic
  sessions: PrepCatalogSession[]
  doneCount: number
  implementedCount: number
}

/** Implemented prep sessions for an adventure. */
export function getPracticesForMission(missionId: string) {
  return sideMissions
    .filter((session) => session.adventureIds.includes(missionId) && isPrepImplemented(session.id))
    .map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      playable: session.playable,
      minutes: session.estimatedMinutes,
      topicId: session.topicId,
      level: session.level,
    }))
    .sort((a, b) => a.level - b.level)
}

/** Prep sessions in a topic, ordered by level. */
export function getPrepSessionsForTopic(topicId: PrepTopicId) {
  return sideMissions
    .filter((session) => session.topicId === topicId)
    .sort((a, b) => a.level - b.level)
}

export function buildPrepCatalog(completedSideMissionIds: string[]): PrepCatalogTopic[] {
  return prepTopics
    .map((topic) => {
      const sessions = getPrepSessionsForTopic(topic.id).map((session) => ({
        session,
        implemented: isPrepImplemented(session.id),
        completed: completedSideMissionIds.includes(session.id),
      }))
      return {
        topic,
        sessions,
        doneCount: sessions.filter((item) => item.completed).length,
        implementedCount: sessions.filter((item) => item.implemented).length,
      }
    })
    .filter((topic) => topic.sessions.length > 0)
}

/** Adventures linked to a prep session. */
export function getAdventuresForPrep(prepId: string) {
  const session = getSideMission(prepId)
  if (!session) return []
  return session.adventureIds.map((id) => ({ id, title: id }))
}
