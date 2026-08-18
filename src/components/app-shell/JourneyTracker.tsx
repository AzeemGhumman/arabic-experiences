import { Link } from "react-router-dom"
import { useActiveJourney } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const accentDot: Record<string, string> = {
  terracotta: "bg-terracotta",
  gold: "bg-gold",
  sage: "bg-sage",
  sky: "bg-sky",
}

export function JourneyTracker() {
  const { journey, stats } = useActiveJourney()
  const { t, journey: journeyCopy } = useI18n()
  const copy = journeyCopy(journey.category)

  return (
    <Link
      to="/"
      className="flex items-center justify-between gap-3 border-b border-border/80 bg-paper/90 px-4 py-2.5 backdrop-blur-md sm:px-5"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn("size-2 shrink-0 rounded-full", accentDot[journey.accent] ?? "bg-terracotta")} />
        <span className="font-display truncate text-sm">{copy.title}</span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
          {t("common.active")}
        </span>
      </div>
      <p className="shrink-0 text-xs font-semibold text-ink-soft">
        {stats.done}/{stats.total}
      </p>
    </Link>
  )
}
