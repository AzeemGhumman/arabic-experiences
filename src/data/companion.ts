import type { JourneyCategory } from "@/lib/storage"

export type CompanionTrip = "umrah" | "hajj"

export function hasTripCompanion(journeyId: JourneyCategory): journeyId is CompanionTrip {
  return journeyId === "umrah" || journeyId === "hajj"
}

export const companionTools = [
  {
    id: "checklist",
    title: "Checklist",
    subtitle: "A todo list for each stage of the trip",
  },
  {
    id: "duas",
    title: "Supplications",
    subtitle: "Duas you can open while you are there",
  },
  {
    id: "reading",
    title: "Reading",
    subtitle: "PDFs and notes for offline use",
  },
]
