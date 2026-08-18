import type { Journey } from "@/lib/storage"

export const journeys: Journey[] = [
  {
    id: "umrah",
    title: "Prepare for Umrah",
    description: "A calm companion from packing to standing before the Kaaba.",
    category: "umrah",
    progress: 28,
    status: "in-progress",
    estimatedMinutes: 45,
    accent: "terracotta",
  },
  {
    id: "hajj",
    title: "Prepare for Hajj",
    description: "Walk the days of Hajj as a journey, not a checklist.",
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
    progress: 12,
    status: "in-progress",
    estimatedMinutes: 30,
    accent: "sage",
  },
  {
    id: "quran",
    title: "Quranic Vocabulary Adventures",
    description: "Discover words through gardens, animals, homes, and motion.",
    category: "quran",
    progress: 8,
    status: "not-started",
    estimatedMinutes: 25,
    accent: "sky",
  },
]

export function getJourney(id: string) {
  return journeys.find((journey) => journey.id === id)
}
