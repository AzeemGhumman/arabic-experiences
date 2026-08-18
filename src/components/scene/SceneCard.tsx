import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export function SceneCard({
  title,
  description,
  to,
  status,
  illustration,
}: {
  title: string
  description: string
  to?: string
  status: "not-started" | "in-progress" | "completed" | "coming-soon"
  illustration: ReactNode
}) {
  const disabled = status === "coming-soon"
  const body = (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card transition",
        disabled ? "opacity-75" : "hover:-translate-y-0.5",
      )}
    >
      <div className="h-32">{illustration}</div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg">{title}</h3>
          <span className="text-[11px] font-semibold tracking-wide text-ink-soft uppercase">
            {status === "coming-soon" ? "Soon" : status === "in-progress" ? "Open" : "Start"}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </article>
  )

  if (!to || disabled) return body
  return <Link to={to}>{body}</Link>
}
