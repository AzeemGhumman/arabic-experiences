import { Link } from "react-router-dom"
import type { MouseEvent } from "react"
import { Compass } from "lucide-react"
import { lessonAvailability } from "@/data/learning/availability"
import type { Lesson } from "@/lib/learning-types"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { LessonCompleteCheckbox } from "@/components/study/LessonRow"

export function MissionPrerequisiteList({
  missionId,
  lessons,
  completedLessonIds,
}: {
  missionId: string
  lessons: Lesson[]
  completedLessonIds: string[]
}) {
  const { setLessonCompleted } = useAppState()
  const { t } = useI18n()

  if (lessons.length === 0) return null

  return (
    <section className="space-y-2">
      <h2 className="font-display text-lg leading-tight">{t("mission.lessonsHeading")}</h2>
      {lessons.map((lesson) => {
        const done = completedLessonIds.includes(lesson.id)
        const access = lessonAvailability(lesson.id)
        const href = access === "open" ? `/lessons/${lesson.id}?from=${missionId}` : undefined

        function toggleDone(event: MouseEvent) {
          event.preventDefault()
          event.stopPropagation()
          setLessonCompleted(lesson.id, !done)
        }

        const card = (
          <>
            <Compass className="size-4 shrink-0 text-sky-deep" />
            <span className="min-w-0 flex-1">
              <span className="font-display block text-base leading-tight">{lesson.title}</span>
            </span>
            <LessonCompleteCheckbox
              lessonId={lesson.id}
              completed={done}
              className="size-9"
              onToggle={toggleDone}
            />
          </>
        )

        if (!href) {
          return (
            <div
              key={lesson.id}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-4 py-3 opacity-80"
            >
              {card}
            </div>
          )
        }

        return (
          <Link
            key={lesson.id}
            to={href}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
              done
                ? "border-sage/35 bg-sage/12 hover:bg-sage/18"
                : "border-sky/25 bg-sky/10 hover:bg-sky/15"
            }`}
          >
            {card}
          </Link>
        )
      })}
    </section>
  )
}
