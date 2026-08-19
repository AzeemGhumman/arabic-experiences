import { Link } from "react-router-dom"
import { Compass } from "lucide-react"
import { ExperienceScene, sceneForExperience } from "@/components/adventure/ExperienceScenes"
import { Badge } from "@/components/ui/badge"
import type { Adventure } from "@/lib/learning-types"
import { isMissionImplemented } from "@/data/learning/availability"
import { cn } from "@/lib/utils"

export function AdventureCard({
  adventure,
  completed,
  plays,
}: {
  adventure: Adventure
  completed?: boolean
  plays?: number
}) {
  const implemented = isMissionImplemented(adventure.id)
  const to = implemented && adventure.playable ? `/adventures/${adventure.id}` : undefined
  return (
    <article
      className={cn(
        "rounded-3xl border border-border bg-card p-3",
        adventure.playable ? "transition" : "opacity-80",
      )}
    >
      <div className="flex gap-3">
        <ExperienceScene
          scene={sceneForExperience(adventure.id)}
          thumb
          className="h-16 w-[4.6rem] shrink-0 rounded-2xl"
        />
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-terracotta uppercase">
                {adventure.type.replace("-", " ")}
              </p>
              <h3 className="font-display mt-1 text-lg leading-tight">{adventure.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{adventure.subtitle}</p>
            </div>
            <Badge className={completed ? "bg-sage/15 text-sage-deep" : "bg-secondary"}>
              {completed ? "Done" : implemented && adventure.playable ? "Start" : "Coming soon"}
            </Badge>
          </div>
          <p className="mt-2 text-xs font-semibold text-ink-soft">
            {Object.keys(adventure.capabilityRewards)[0]} · {adventure.estimatedMinutes} min
            {plays ? ` · replayed ${plays}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {to ? (
          <Link
            to={to}
            className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-terracotta text-sm font-semibold text-white"
          >
            Play
          </Link>
        ) : null}
        {implemented ? (
          <Link
            to={`/missions/${adventure.id}`}
            className="flex min-h-11 flex-1 items-center justify-center rounded-full border border-border text-sm font-semibold text-sky-deep"
          >
            Mission
          </Link>
        ) : null}
      </div>
    </article>
  )
}

export function SideMissionCard({
  title,
  description,
  to,
  minutes,
  gain,
  locked,
}: {
  title: string
  description: string
  to?: string
  minutes: number
  gain: number
  locked?: boolean
}) {
  const body = (
    <article className={cn("rounded-3xl border border-sky/30 bg-sky/10 p-4", locked && "opacity-60")}>
      <p className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] text-sky-deep uppercase">
        <Compass className="size-3.5" />
        Side mission
      </p>
      <h3 className="font-display mt-1 text-xl">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <p className="mt-2 text-xs font-semibold text-sky-deep">
        +{gain} vocabulary · ~{minutes} min
      </p>
    </article>
  )
  if (!to || locked) return body
  return <Link to={to}>{body}</Link>
}
