import type { PrepTopic, PrepTopicId } from "@/lib/learning-types"

export const prepTopics: PrepTopic[] = [
  {
    id: "numbers",
    title: "Numbers",
    description: "Count, order, and recognize numbers in real situations.",
    order: 1,
  },
  {
    id: "navigation",
    title: "Navigation",
    description: "Taxi words, directions, and finding your way.",
    order: 2,
  },
  {
    id: "food",
    title: "Food",
    description: "Ordering, customizing, and closing a meal.",
    order: 3,
  },
  {
    id: "colors",
    title: "Colors",
    description: "Name and recognize colors — from basics to richer shades.",
    order: 4,
  },
]

export function getPrepTopic(id: PrepTopicId) {
  return prepTopics.find((topic) => topic.id === id)
}
