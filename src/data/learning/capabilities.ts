import type { CapabilityDef } from "@/lib/learning-types"

export const capabilities: CapabilityDef[] = [
  {
    id: "navigation",
    title: "Navigation",
    depths: ["Ask where something is", "Follow multi-step directions", "Give directions to someone else"],
  },
  {
    id: "numbers",
    title: "Numbers",
    depths: ["Use 1–8 in a gate or order", "Handle 9–20 in rooms, buses, prices", "Use larger numbers in the city"],
  },
  {
    id: "food",
    title: "Food",
    depths: ["Order a simple meal", "Ask for with / without and quantities", "Handle a fuller menu"],
  },
  {
    id: "money",
    title: "Money",
    depths: ["Ask how much", "Understand a simple price", "Handle change and bargaining"],
  },
  {
    id: "family",
    title: "Family",
    depths: ["Name who you are looking for", "Describe a meeting point", "Handle a separation calmly"],
  },
  {
    id: "transportation",
    title: "Transportation",
    depths: ["Name a destination", "Ride a taxi or bus", "Follow a richer route"],
  },
  {
    id: "hotel",
    title: "Hotel",
    depths: ["Name the hotel", "Ask for a room or floor", "Handle check-in language"],
  },
  {
    id: "emergency",
    title: "Emergency",
    depths: ["Ask for help", "Name a need clearly", "Describe what is wrong"],
  },
  {
    id: "health",
    title: "Health",
    depths: ["Say you feel sick", "Find a pharmacy", "Describe pain simply"],
  },
  {
    id: "haram",
    title: "The Haram",
    depths: ["Recognize gates and crowd signs", "Follow movement instructions", "Name ritual places"],
  },
  {
    id: "hajj-locations",
    title: "Hajj places",
    depths: ["Name Mina and Arafat", "Find a bus or camp", "Move between the days"],
  },
  {
    id: "time",
    title: "Time",
    depths: ["Ask how many minutes", "Understand a simple schedule", "Plan a meeting time"],
  },
]

export function getCapability(id: string) {
  return capabilities.find((item) => item.id === id)
}

export function depthLabel(level: number) {
  if (level >= 3) return "Master"
  if (level >= 2) return "Advanced"
  if (level >= 1) return "Basic"
  return "Not started"
}
