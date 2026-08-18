import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JourneyStatus } from "@/lib/storage"

export function JourneyNode({
  title,
  subtitle,
  status,
  index,
  active = false,
}: {
  title: string
  subtitle: string
  status: JourneyStatus
  index: number
  active?: boolean
}) {
  const done = status === "completed"
  const current = status === "in-progress" || active

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-full border-2 text-sm font-semibold transition",
            done && "border-sage bg-sage text-white",
            current && !done && "border-terracotta bg-terracotta text-white shadow-[0_0_0_6px_rgba(196,120,90,0.18)]",
            !done && !current && "border-border bg-paper text-ink-soft",
          )}
        >
          {done ? <Check className="size-4" /> : index + 1}
        </div>
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 rounded-2xl border px-4 py-3",
          current ? "border-terracotta/40 bg-paper" : "border-transparent bg-paper/60",
        )}
      >
        <p className="font-display text-lg leading-tight">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
