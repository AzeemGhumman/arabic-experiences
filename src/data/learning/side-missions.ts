import type { SideMission } from "@/lib/learning-types"
import { buildFood, buildNavigation, buildNumbers } from "@/data/learning/builders"

export const sideMissions: SideMission[] = [
  {
    id: "numbers-everywhere",
    title: "Numbers Everywhere",
    eyebrow: "Prep",
    description: "Study numbers 1–10, first–third, then 11–20.",
    unlockAfterAdventureIds: ["find-haram", "order-dinner", "enter-haram", "taxi-hotel"],
    vocabularyGain: 23,
    estimatedMinutes: 5,
    capabilityId: "numbers",
    capabilityLevel: 2,
    playable: true,
    canNowDo: "Recognize numbers 1–20 and first, second, third.",
    buildRun: buildNumbers,
  },
  {
    id: "master-navigation",
    title: "Master Navigation",
    eyebrow: "Prep",
    description: "Taxi words first, then follow a short Arabic GPS.",
    unlockAfterAdventureIds: ["find-haram", "enter-haram", "taxi-hotel"],
    vocabularyGain: 18,
    estimatedMinutes: 5,
    capabilityId: "navigation",
    capabilityLevel: 2,
    playable: true,
    canNowDo: "Use taxi words and follow simple spoken directions.",
    buildRun: buildNavigation,
  },
  {
    id: "explore-food",
    title: "Explore Arabic Food",
    eyebrow: "Prep",
    description: "Study with / without, spice, juice, and ordering for a group.",
    unlockAfterAdventureIds: ["order-dinner"],
    vocabularyGain: 14,
    estimatedMinutes: 5,
    capabilityId: "food",
    capabilityLevel: 2,
    playable: true,
    canNowDo: "Order with / without and for a small group.",
    buildRun: buildFood,
  },
]

export function getSideMission(id: string) {
  return sideMissions.find((item) => item.id === id)
}

export function unlockedSideMissions(completedAdventureIds: string[], completedSideMissionIds: string[]) {
  return sideMissions.filter(
    (mission) =>
      mission.unlockAfterAdventureIds.some((id) => completedAdventureIds.includes(id)) &&
      !completedSideMissionIds.includes(mission.id),
  )
}
