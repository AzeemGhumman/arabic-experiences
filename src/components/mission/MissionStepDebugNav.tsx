import { useState } from "react"
import type { MissionStep } from "@/lib/learning-types"

function stepDebugLabel(step: MissionStep, index: number): string {
  let detail = ""
  switch (step.type) {
    case "context":
      detail = step.title
      break
    case "study":
      detail = `${step.groups.length} group${step.groups.length === 1 ? "" : "s"}`
      break
    case "discover":
    case "choice":
    case "direction":
    case "phrase":
    case "match":
    case "listen":
    case "decision":
    case "gps":
      detail = step.prompt
      break
  }
  const trimmed = detail.trim()
  const short = trimmed.length > 42 ? `${trimmed.slice(0, 39)}…` : trimmed
  return short ? `${index + 1}. ${step.type} — ${short}` : `${index + 1}. ${step.type}`
}

export function MissionStepDebugNav({
  steps,
  stepIndex,
  onJump,
}: {
  steps: MissionStep[]
  stepIndex: number
  onJump: (index: number) => void
}) {
  const [open, setOpen] = useState(true)

  if (!import.meta.env.DEV) return null

  return (
    <section
      aria-label="Mission step debug navigation"
      className="rounded-xl border border-dashed border-amber-400/70 bg-amber-50/80 p-3 text-xs dark:border-amber-500/50 dark:bg-amber-950/30"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold tracking-wide text-amber-900 uppercase dark:text-amber-200">
          Dev: jump to step
        </p>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-[11px] font-medium text-amber-900 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900/40"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {steps.map((step, index) => {
            const active = index === stepIndex
            return (
              <li key={`${step.type}-${index}`}>
                <button
                  type="button"
                  title={stepDebugLabel(step, index)}
                  className={[
                    "max-w-full rounded-md border px-2 py-1 text-left leading-snug transition-colors",
                    active
                      ? "border-amber-600 bg-amber-200 font-semibold text-amber-950 dark:border-amber-400 dark:bg-amber-800 dark:text-amber-50"
                      : "border-amber-300/80 bg-white/80 text-amber-950 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-900/50",
                  ].join(" ")}
                  onClick={() => onJump(index)}
                >
                  {stepDebugLabel(step, index)}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}
