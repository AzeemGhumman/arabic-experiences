import type { SideMission } from "@/lib/learning-types"
import { buildFood, buildNavigation, buildNumbers } from "@/data/learning/builders"
import { getPrepTopic } from "@/data/learning/prep-topics"

function prepTitle(session: Pick<SideMission, "topicId" | "levelName">) {
  const topic = getPrepTopic(session.topicId)
  return `${topic?.title ?? session.topicId} - ${session.levelName}`
}

export const sideMissions: SideMission[] = [
  {
    id: "numbers-everywhere",
    title: prepTitle({ topicId: "numbers", levelName: "Basic" }),
    eyebrow: "Prep",
    description: "Study numbers 1–10, first–third, then 11–20.",
    topicId: "numbers",
    level: 1,
    levelName: "Basic",
    adventureIds: [
      "airport-arrival",
      "taxi-hotel",
      "find-haram",
      "enter-haram",
      "begin-tawaf",
      "complete-sai",
      "order-dinner",
      "hajj-bus",
    ],
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
    title: prepTitle({ topicId: "navigation", levelName: "Basic" }),
    eyebrow: "Prep",
    description: "Taxi words first, then follow a short Arabic GPS.",
    topicId: "navigation",
    level: 1,
    levelName: "Basic",
    adventureIds: ["airport-arrival", "taxi-hotel", "find-haram", "enter-haram"],
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
    title: prepTitle({ topicId: "food", levelName: "Basic" }),
    eyebrow: "Prep",
    description: "Study with / without, spice, juice, and ordering for a group.",
    topicId: "food",
    level: 1,
    levelName: "Basic",
    adventureIds: ["find-zamzam", "order-dinner"],
    unlockAfterAdventureIds: ["order-dinner"],
    vocabularyGain: 14,
    estimatedMinutes: 5,
    capabilityId: "food",
    capabilityLevel: 2,
    playable: true,
    canNowDo: "Order with / without and for a small group.",
    buildRun: buildFood,
  },
  {
    id: "colors-basic",
    title: prepTitle({ topicId: "colors", levelName: "Basic" }),
    eyebrow: "Prep",
    description: "Red, blue, green, white, black — the colors you meet first.",
    topicId: "colors",
    level: 1,
    levelName: "Basic",
    adventureIds: [],
    unlockAfterAdventureIds: [],
    vocabularyGain: 10,
    estimatedMinutes: 4,
    capabilityId: "navigation",
    capabilityLevel: 1,
    playable: false,
    canNowDo: "Name basic colors in Arabic.",
  },
  {
    id: "colors-extended",
    title: prepTitle({ topicId: "colors", levelName: "More" }),
    eyebrow: "Prep",
    description: "Light, dark, and mixed shades for richer descriptions.",
    topicId: "colors",
    level: 2,
    levelName: "More",
    adventureIds: [],
    unlockAfterAdventureIds: ["colors-basic"],
    vocabularyGain: 12,
    estimatedMinutes: 5,
    capabilityId: "navigation",
    capabilityLevel: 2,
    playable: false,
    canNowDo: "Describe colors with more nuance.",
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
