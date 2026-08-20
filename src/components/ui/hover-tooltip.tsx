import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Hover-only hint for web; wraps disabled controls that do not receive pointer events. */
export function HoverTooltip({
  lines,
  children,
  className,
}: {
  lines: string[]
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn("group/tooltip relative block w-full", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 w-max max-w-[min(18rem,calc(100vw-2rem))]",
          "-translate-x-1/2 rounded-xl border border-border bg-paper px-3 py-2 text-center text-sm leading-snug text-ink shadow-md",
          "opacity-0 transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          "max-sm:hidden",
        )}
      >
        {lines.map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))}
      </span>
    </span>
  )
}
