import { useEffect, useState, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

const COLORS = ["#c4785a", "#8fa88a", "#d4a574", "#7ba3b8", "#e8c9b0", "#c4a35a", "#6e8b74"]

export function MissionCelebration({ active }: { active: boolean }) {
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (!active) return
    setBurst(true)
    const timer = window.setTimeout(() => setBurst(false), 4500)
    return () => window.clearTimeout(timer)
  }, [active])

  if (!burst) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {Array.from({ length: 60 }).map((_, index) => {
        const left = 4 + ((index * 13 + index * index) % 92)
        const delay = (index % 10) * 0.12 + Math.random() * 0.15
        const color = COLORS[index % COLORS.length]
        const size = index % 3 === 0 ? "size-3" : index % 3 === 1 ? "size-2.5" : "size-2"
        const shape = index % 4 === 0 ? "rounded-sm" : "rounded-full"
        const sway = index % 2 === 0 ? 30 + (index % 5) * 12 : -(30 + (index % 5) * 12)
        const duration = 3.2 + (index % 5) * 0.4
        return (
          <span
            key={index}
            className={cn("celebration-piece absolute top-[-5%] opacity-0", size, shape)}
            style={
              {
                left: `${left}%`,
                backgroundColor: color,
                animationDelay: `${delay}s`,
                "--sway": `${sway}px`,
                "--duration": `${duration}s`,
              } as CSSProperties
            }
          />
        )
      })}
      <style>{`
        @keyframes celebration-fall {
          0% {
            opacity: 0;
            transform: translate3d(0, -20px, 0) scale(0.5) rotate(0deg);
          }
          8% {
            opacity: 1;
          }
          50% {
            opacity: 1;
            transform: translate3d(var(--sway), 45vh, 0) scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translate3d(calc(var(--sway) * -0.5), 105vh, 0) scale(0.7) rotate(360deg);
          }
        }
        .celebration-piece {
          animation: celebration-fall var(--duration) ease-out forwards;
        }
      `}</style>
    </div>
  )
}
