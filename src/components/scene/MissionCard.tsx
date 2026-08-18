import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MissionCard({
  prompt,
  complete,
  onComplete,
  children,
}: {
  prompt: string
  complete: boolean
  onComplete?: () => void
  children?: ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border p-5",
        complete ? "border-sage/40 bg-sage/10" : "border-terracotta/30 bg-paper",
      )}
    >
      <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
        Mission
      </p>
      <h3 className="font-display mt-1 text-2xl leading-tight">{prompt}</h3>
      {children}
      {onComplete && !complete ? (
        <Button className="mt-4 w-full" variant="terracotta" onClick={onComplete}>
          Mark mission complete
        </Button>
      ) : null}
      {complete ? (
        <p className="mt-4 text-sm font-medium text-sage-deep">
          You can now sit down and ask for a simple meal.
        </p>
      ) : null}
    </section>
  )
}
