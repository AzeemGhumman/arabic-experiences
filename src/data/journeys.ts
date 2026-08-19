import type { Journey, JourneyCategory } from "@/lib/storage"

export const journeys: Journey[] = [
  {
    id: "umrah",
    title: "Arabic for Umrah",
    description: "Learn the Arabic you'll need — mission by mission.",
    category: "umrah",
    progress: 28,
    status: "in-progress",
    estimatedMinutes: 45,
    accent: "terracotta",
  },
  {
    id: "hajj",
    title: "Arabic for Hajj",
    description: "Learn the Arabic you'll need for the days of Hajj.",
    category: "hajj",
    progress: 0,
    status: "coming-soon",
    estimatedMinutes: 90,
    accent: "gold",
  },
  {
    id: "arabic",
    title: "Arabic for Real Life",
    description: "Complete everyday missions using the words around you.",
    category: "arabic",
    progress: 0,
    status: "coming-soon",
    estimatedMinutes: 30,
    accent: "sage",
  },
  {
    id: "quran",
    title: "Quranic Vocabulary Adventures",
    description: "Discover words through gardens, animals, homes, and motion.",
    category: "quran",
    progress: 0,
    status: "coming-soon",
    estimatedMinutes: 25,
    accent: "sky",
  },
]

/** Journeys available in the preview release. Expand as content ships. */
const PREVIEW_RELEASED_JOURNEY_IDS = new Set<JourneyCategory>(["umrah"])

export function isJourneyReleased(id: string) {
  return PREVIEW_RELEASED_JOURNEY_IDS.has(id as JourneyCategory)
}

export function getJourney(id: string) {
  return journeys.find((journey) => journey.id === id)
}
