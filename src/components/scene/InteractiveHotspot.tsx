import { cn } from "@/lib/utils"

export function InteractiveHotspot({
  label,
  caption,
  x,
  y,
  w,
  h,
  discovered,
  selected,
  onSelect,
}: {
  label: string
  caption?: string
  x: number
  y: number
  w?: number
  h?: number
  discovered?: boolean
  selected?: boolean
  onSelect: () => void
}) {
  const boxed = w != null && h != null

  return (
    <button
      type="button"
      aria-label={discovered ? `${label}, discovered` : `Discover ${label}`}
      onClick={onSelect}
      className={cn(
        "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        boxed ? "flex items-center justify-center" : "flex size-8 items-center justify-center rounded-full border-2",
        !boxed && discovered && "border-sage bg-sage text-white",
        !boxed && !discovered && "hotspot-pulse border-white bg-terracotta text-white",
        !boxed && selected && "scale-110 ring-4 ring-gold-soft/80",
        boxed && selected && "bg-gold/20 ring-2 ring-gold",
        boxed && discovered && !selected && "bg-sage/10",
      )}
      style={
        boxed
          ? { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }
          : { left: `${x}%`, top: `${y}%` }
      }
    >
      {boxed ? (
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full border-2 shadow-sm",
            discovered ? "border-sage bg-sage text-white" : "hotspot-pulse border-white bg-terracotta text-white",
            selected && "ring-4 ring-gold-soft/80",
          )}
        >
          <span className="size-2 rounded-full bg-white" />
        </span>
      ) : (
        <span className="size-2 rounded-full bg-white" />
      )}
      {caption ? (
        <span className="arabic-text pointer-events-none absolute bottom-1 left-1/2 z-20 -translate-x-1/2 rounded-full bg-paper/95 px-2 py-0.5 text-sm font-semibold whitespace-nowrap text-ink shadow-sm">
          {caption}
        </span>
      ) : null}
      <span className="sr-only">{label}</span>
    </button>
  )
}
