import { cn } from "@/lib/utils"
import type { JourneyCategory } from "@/lib/storage"

const palettes: Record<JourneyCategory, { from: string; to: string }> = {
  umrah: { from: "#f3d4c4", to: "#c4785a" },
  hajj: { from: "#ead7a4", to: "#c4a35a" },
  arabic: { from: "#d5e4d4", to: "#6e8b74" },
  quran: { from: "#cfe3ea", to: "#7ba8b8" },
}

export function JourneyIllustration({
  category,
  className,
}: {
  category: JourneyCategory
  className?: string
}) {
  const palette = palettes[category]

  return (
    <div
      className={cn("relative overflow-hidden rounded-3xl", className)}
      style={{
        background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
      aria-hidden
    >
      {category === "umrah" && <KaabaMark />}
      {category === "hajj" && <TentMark />}
      {category === "arabic" && <TableMark />}
      {category === "quran" && <GardenMark />}
    </div>
  )
}

function KaabaMark() {
  return (
    <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full">
      <circle cx="100" cy="92" r="54" fill="none" stroke="rgba(255,253,248,0.45)" strokeWidth="2" />
      <circle cx="100" cy="92" r="38" fill="none" stroke="rgba(255,253,248,0.28)" strokeWidth="1.5" />
      <rect x="78" y="48" width="44" height="48" rx="3" fill="#2b241f" />
      <rect x="78" y="66" width="44" height="6" fill="#c4a35a" />
      <circle cx="46" cy="108" r="3" fill="rgba(255,253,248,0.7)" />
      <circle cx="154" cy="104" r="2.5" fill="rgba(255,253,248,0.7)" />
      <circle cx="68" cy="116" r="2" fill="rgba(255,253,248,0.55)" />
    </svg>
  )
}

function TentMark() {
  return (
    <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full">
      <path d="M30 110 L70 48 L110 110 Z" fill="rgba(255,253,248,0.55)" />
      <path d="M86 110 L126 40 L166 110 Z" fill="rgba(255,253,248,0.35)" />
      <path d="M20 110 H180" stroke="rgba(58,47,38,0.25)" strokeWidth="3" />
      <circle cx="160" cy="36" r="10" fill="#fff8e8" />
    </svg>
  )
}

function TableMark() {
  return (
    <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full">
      <ellipse cx="100" cy="92" rx="62" ry="18" fill="rgba(255,253,248,0.4)" />
      <rect x="48" y="70" width="104" height="14" rx="7" fill="rgba(255,253,248,0.75)" />
      <circle cx="78" cy="64" r="10" fill="#f4ede3" />
      <circle cx="108" cy="60" r="14" fill="#efe4d4" />
      <rect x="128" y="48" width="18" height="24" rx="3" fill="#fffdf8" />
    </svg>
  )
}

function GardenMark() {
  return (
    <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full">
      <circle cx="150" cy="32" r="16" fill="#f8e7a8" />
      <circle cx="62" cy="78" r="28" fill="rgba(79,107,86,0.55)" />
      <rect x="58" y="88" width="8" height="28" fill="rgba(58,47,38,0.35)" />
      <path d="M20 118 C60 96, 120 128, 190 108" fill="none" stroke="rgba(255,253,248,0.7)" strokeWidth="6" />
      <circle cx="108" cy="54" r="6" fill="#c4785a" />
    </svg>
  )
}
