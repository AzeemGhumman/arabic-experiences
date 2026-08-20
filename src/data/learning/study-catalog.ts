import { isLessonImplemented } from "@/data/learning/availability"
import { studyTopics } from "@/data/learning/topics"
import { getLesson, lessons } from "@/data/learning/lessons"
import type { Lesson, Topic, TopicId } from "@/lib/learning-types"

export type CatalogLesson = {
  lesson: Lesson
  implemented: boolean
  completed: boolean
}

export type CatalogTopic = {
  topic: Topic
  lessons: CatalogLesson[]
  doneCount: number
  implementedCount: number
}

/** Implemented study lessons linked to a mission. */
export function getPracticesForMission(missionId: string) {
  return lessons
    .filter((lesson) => lesson.missionIds.includes(missionId) && isLessonImplemented(lesson.id))
    .map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      playable: lesson.playable,
      minutes: lesson.estimatedMinutes,
      topicId: lesson.topicId,
      level: lesson.level,
    }))
    .sort((a, b) => a.level - b.level)
}

/** Lessons in a topic, ordered by level. */
export function getLessonsForTopic(topicId: TopicId) {
  return lessons
    .filter((lesson) => lesson.topicId === topicId)
    .sort((a, b) => a.level - b.level)
}

export function buildStudyCatalog(completedLessonIds: string[]): CatalogTopic[] {
  return studyTopics
    .map((topic) => {
      const topicLessons = getLessonsForTopic(topic.id).map((lesson) => ({
        lesson,
        implemented: isLessonImplemented(lesson.id),
        completed: completedLessonIds.includes(lesson.id),
      }))
      return {
        topic,
        lessons: topicLessons,
        doneCount: topicLessons.filter((item) => item.completed).length,
        implementedCount: topicLessons.filter((item) => item.implemented).length,
      }
    })
    .filter((topic) => topic.lessons.length > 0)
}

export type StudyShelfId = "arrive" | "stay" | "worship" | "speak"

export const studyShelves: { id: StudyShelfId; topicIds: TopicId[] }[] = [
  {
    id: "arrive",
    topicIds: ["packing", "airport", "transport", "navigation", "geography", "numbers", "polite"],
  },
  {
    id: "stay",
    topicIds: ["hotel", "room-service", "food", "money", "shopping", "time"],
  },
  {
    id: "worship",
    topicIds: ["haram", "ritual", "nabawi", "barber", "clothes"],
  },
  {
    id: "speak",
    topicIds: ["family", "health", "body", "actions", "adjectives", "colors", "nature"],
  },
]

export type StudyCatalogShelf = {
  id: StudyShelfId
  topics: CatalogTopic[]
}

export function groupStudyCatalog(catalog: CatalogTopic[]): StudyCatalogShelf[] {
  const byId = new Map(catalog.map((topic) => [topic.topic.id, topic]))
  return studyShelves
    .map((shelf) => ({
      id: shelf.id,
      topics: shelf.topicIds.flatMap((id) => {
        const topic = byId.get(id)
        return topic ? [topic] : []
      }),
    }))
    .filter((shelf) => shelf.topics.length > 0)
}

/** Missions a lesson supports. */
export function getMissionsForLesson(lessonId: string) {
  const lesson = getLesson(lessonId)
  if (!lesson) return []
  return lesson.missionIds.map((id) => ({ id, title: id }))
}
