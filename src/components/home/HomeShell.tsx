import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function HomeShell({
  kicker,
  kickerClassName,
  title,
  intro,
  children,
}: {
  kicker: string
  kickerClassName?: string
  title: string
  intro: string
  children: ReactNode
}) {
  return (
    <div className="space-y-5 pb-8">
      <header>
        <p className={cn("text-[11px] font-semibold tracking-[0.2em] uppercase", kickerClassName ?? "text-terracotta")}>
          {kicker}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      </header>
      {children}
    </div>
  )
}
