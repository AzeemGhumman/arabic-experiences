import type { MouseEvent } from "react"
import { Link } from "react-router-dom"
import { Check } from "lucide-react"
import { lessonAvailability } from "@/data/learning/availability"
import { isLessonOpened } from "@/data/learning/mission-prerequisites"
import type { CatalogLesson } from "@/data/learning/study-catalog"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LessonCompleteCheckbox({
  lessonId,
  completed,
  className,
  onToggle,
}: {
  lessonId: string
  completed: boolean
  className?: string
  onToggle: (event: MouseEvent) => void
}) {
  const { t } = useI18n()
  const { progress } = useActiveJourney()
  const access = lessonAvailability(lessonId)
  const opened = isLessonOpened(lessonId, progress.openedLessonIds)
  if (access !== "open" || !opened) return null

  return (
    <button
      type="button"
      aria-label={completed ? t("study.markIncomplete") : t("study.markComplete")}
      aria-pressed={completed}
      onClick={onToggle}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition",
        completed
          ? "border-sage bg-sage text-white"
          : "border-border/70 bg-paper hover:border-sage/50",
        className,
      )}
    >
      <Check className={cn("size-4 stroke-[3]", completed ? "text-white opacity-100" : "opacity-0")} />
    </button>
  )
}

export function LessonDoneButton({
  item,
  className,
}: {
  item: CatalogLesson
  className?: string
}) {
  const { setLessonCompleted } = useAppState()
  const { lesson, completed } = item

  function toggleDone(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setLessonCompleted(lesson.id, !completed)
  }

  return (
    <LessonCompleteCheckbox
      lessonId={lesson.id}
      completed={completed}
      className={className}
      onToggle={toggleDone}
    />
  )
}

export function LessonRow({
  item,
  label,
  className,
  compact,
}: {
  item: CatalogLesson
  label?: string
  className?: string
  compact?: boolean
}) {
  const { t } = useI18n()
  const { lesson, completed } = item
  const access = lessonAvailability(lesson.id)
  const href = access === "open" ? `/lessons/${lesson.id}?from=study` : undefined
  const status = access === "coming-soon" ? t("journeys.statusComingSoon") : null

  const inner = (
    <>
      <span className="min-w-0 flex-1 truncate text-sm font-medium leading-tight">
        {label ?? status}
      </span>
      <LessonDoneButton item={item} className={compact ? "size-6" : undefined} />
    </>
  )

  const surface = cn(
    "flex items-center",
    compact ? "min-h-8 py-0.5 pe-0.5" : "min-h-11 gap-2 px-3 py-2",
    className,
    access === "open" && completed && "bg-sage/10",
    access === "coming-soon" && "opacity-70",
  )

  if (!href) {
    return <div className={surface}>{inner}</div>
  }

  return (
    <Link to={href} className={cn(surface, "transition hover:bg-sky/10")}>
      {inner}
    </Link>
  )
}
