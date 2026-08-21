import type { LanguagePack } from "@/locales/types"
import type { Lesson } from "@/lib/learning-types"

export function resolveLessonGroupCopy(
  pack: LanguagePack,
  lessonId: string,
  copyKey: string | undefined,
  fallback: { title: string; intro?: string },
) {
  const localized = copyKey ? pack.lessonRuns[lessonId]?.groups?.[copyKey] : undefined
  return {
    title: localized?.title ?? fallback.title,
    intro: localized?.intro ?? fallback.intro,
  }
}

export function resolveLessonOutcome(pack: LanguagePack, lessonId: string, fallback: string) {
  return pack.lessonRuns[lessonId]?.outcome ?? fallback
}

export function lessonDisplayTitle(
  pack: LanguagePack,
  lesson: Pick<Lesson, "id" | "topicId" | "level" | "levelName" | "title">,
) {
  const topicPath = `topics.${lesson.topicId}.title`
  // callers should prefer useI18n().lessonTitle
  const topic = pack.ui.study.topics[lesson.topicId]?.title
  const level =
    lesson.level >= 2 ? pack.ui.study.levelAdvanced : pack.ui.study.levelBasic
  if (topic) return `${topic} — ${level}`
  return lesson.title
}
