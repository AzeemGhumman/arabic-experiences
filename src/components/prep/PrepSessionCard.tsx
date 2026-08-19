import type { MouseEvent } from "react"
import { Link } from "react-router-dom"
import { Check } from "lucide-react"
import { prepAvailability } from "@/data/learning/availability"
import type { PrepCatalogSession } from "@/data/learning/prep-catalog"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function PrepSessionRow({ item }: { item: PrepCatalogSession }) {
  const { t } = useI18n()
  const { setPrepCompleted } = useAppState()
  const { session, completed } = item
  const access = prepAvailability(session.id)
  const href = access === "open" ? `/side-missions/${session.id}?from=prep` : undefined

  function toggleDone(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (access !== "open") return
    setPrepCompleted(session.id, !completed)
  }

  const meta =
    access === "coming-soon"
      ? t("journeys.statusComingSoon")
      : session.estimatedMinutes
        ? `${session.estimatedMinutes} ${t("common.min")}`
        : null

  const rowClass = cn(
    "flex min-h-10 items-center gap-2 px-3 py-2",
    access === "open" && completed && "bg-sage/10",
    access === "open" && !completed && "bg-sky/[0.06]",
    access === "coming-soon" && "opacity-70",
  )

  const inner = (
    <>
      <span className="min-w-0 flex-1 truncate text-sm font-medium leading-tight">{session.title}</span>
      {meta ? <span className="shrink-0 text-[11px] text-muted-foreground">{meta}</span> : null}
      {access === "open" ? (
        <button
          type="button"
          aria-label={completed ? t("prep.markIncomplete") : t("prep.markComplete")}
          aria-pressed={completed}
          onClick={toggleDone}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition",
            completed
              ? "border-sage bg-sage text-white"
              : "border-border/70 bg-paper hover:border-sage/50",
          )}
        >
          <Check
            className={cn("size-4 stroke-[3]", completed ? "text-white opacity-100" : "opacity-0")}
          />
        </button>
      ) : null}
    </>
  )

  if (!href) {
    return <div className={rowClass}>{inner}</div>
  }

  return (
    <Link to={href} className={cn(rowClass, "transition hover:bg-sky/10")}>
      {inner}
    </Link>
  )
}

/** @deprecated Use PrepSessionRow */
export const PrepSessionCard = PrepSessionRow
