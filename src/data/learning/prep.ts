/** @deprecated Import from prep-catalog instead. Kept for backwards compatibility. */
export { getPracticesForMission, type PrepCatalogSession, type PrepCatalogTopic } from "@/data/learning/prep-catalog"

export type MissionPractice = {
  id: string
  title: string
  description: string
  playable: boolean
  minutes?: number
  topicId?: string
  level?: number
}
