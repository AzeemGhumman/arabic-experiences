import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function ContextCard({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-3xl border border-border bg-card p-5", className)}>
      <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  )
}
