import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { JourneyIllustration } from "@/components/journey/JourneyIllustration"
import { missionStats, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { getJourneyProgress } from "@/lib/storage"
import type { Journey, JourneyCategory } from "@/lib/storage"
import { cn } from "@/lib/utils"

export function JourneyCard({
  journey,
  to,
  featured = false,
  current = false,
  onSelect,
}: {
  journey: Journey
  to?: string
  featured?: boolean
  current?: boolean
  onSelect?: (id: JourneyCategory) => void
}) {
  const { state } = useAppState()
  const { t, journey: journeyCopy } = useI18n()
  const copy = journeyCopy(journey.category)
  const progress = getJourneyProgress(state, journey.category)
  const stats = missionStats(journey.category, progress)
  const percent = stats.done > 0 ? Math.max(stats.percent, 4) : journey.status === "coming-soon" ? journey.progress : 0
  const muted = journey.status === "coming-soon" && !current
  const actionable = Boolean((onSelect && !current) || to)

  const statusLabel: Record<Journey["status"], string> = {
    "not-started": t("journeys.statusStart"),
    "in-progress": t("journeys.statusInProgress"),
    completed: t("journeys.statusCompleted"),
    "coming-soon": t("journeys.statusComingSoon"),
  }

  const content = (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_16px_40px_-28px_rgba(58,47,38,0.5)] transition duration-300",
        featured ? "p-0" : "",
        muted && "opacity-90",
        current && "border-terracotta ring-2 ring-terracotta/50",
        actionable && "hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-24px_rgba(58,47,38,0.55)]",
      )}
    >
      <div className="relative">
        <JourneyIllustration category={journey.category} className={featured ? "h-40" : "h-28"} />
        {current ? (
          <p className="absolute inset-x-3 bottom-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-semibold text-terracotta shadow-sm">
              <span className="size-2 shrink-0 rounded-full bg-terracotta" />
              {t("journeys.onThisJourney")}
            </span>
          </p>
        ) : null}
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
              {current ? t("journeys.cardCurrent") : t("journeys.cardJourney")}
            </p>
            <h3 className="font-display mt-1 text-xl leading-tight">{copy.title}</h3>
          </div>
          {current ? null : (
            <Badge
              className={cn(
                "shrink-0 whitespace-nowrap",
                journey.status === "in-progress" && "bg-sage/15 text-sage-deep",
                journey.status === "coming-soon" && "bg-gold-soft/60 text-ink",
                journey.status === "completed" && "bg-sky/15 text-sky-deep",
                journey.status === "not-started" && stats.done === 0 && "bg-secondary",
              )}
            >
              {stats.done > 0 ? t("journeys.statusInProgress") : statusLabel[journey.status]}
            </Badge>
          )}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="min-w-0 flex-1">
            <Progress value={percent} />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {t("journeys.progressInJourney", { done: stats.done, total: stats.total })}
            </p>
          </div>
          {actionable ? (
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-ink">
              <ArrowUpRight className="size-4" />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )

  if (onSelect && !current) {
    return (
      <button type="button" className="w-full text-start" onClick={() => onSelect(journey.category)}>
        {content}
      </button>
    )
  }

  if (!to) return content
  return <Link to={to}>{content}</Link>
}
