import { cn } from "@/lib/utils"

export function ProgressRing({
  value,
  size = 72,
  stroke = 7,
  label,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-secondary"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-sage transition-[stroke-dashoffset] duration-700"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={cn("absolute font-display text-sm font-semibold")}>{label ?? `${Math.round(value)}%`}</span>
    </div>
  )
}
