export function RestaurantScene({
  className = "h-full w-full object-cover object-[center_62%]",
}: {
  className?: string
}) {
  return (
    <img
      src="/scenes/restaurant-scene.jpg"
      alt="A wooden restaurant table set with water, rice, chicken, bread, a cup, and a standing menu"
      className={className}
    />
  )
}

export function GardenScene() {
  return (
    <svg viewBox="0 0 390 300" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="garden-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b9d7e4" />
          <stop offset="55%" stopColor="#d7ead8" />
          <stop offset="100%" stopColor="#c8ddb0" />
        </linearGradient>
      </defs>
      <rect width="390" height="300" fill="url(#garden-sky)" />
      <circle cx="318" cy="48" r="28" fill="#f8e7a8" />
      <circle cx="318" cy="48" r="18" fill="#ffe9a0" />
      <ellipse cx="96" cy="168" rx="58" ry="48" fill="#5f8a66" />
      <ellipse cx="128" cy="150" rx="40" ry="36" fill="#6e8b74" />
      <rect x="88" y="168" width="14" height="70" rx="6" fill="#7a5a3a" />
      <circle cx="118" cy="176" r="9" fill="#c4785a" />
      <circle cx="138" cy="164" r="7" fill="#d9845e" />
      <path d="M40 250 C120 210, 220 270, 370 230 L370 300 L40 300 Z" fill="#8aa56b" />
      <path d="M160 230 C210 210, 250 250, 330 236" fill="none" stroke="#7ba8b8" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="248" cy="238" rx="36" ry="10" fill="#6ea0b0" opacity="0.7" />
      <path d="M156 78 C170 92, 186 86, 176 70" fill="#4e7a8a" />
      <ellipse cx="168" cy="72" rx="10" ry="6" fill="#4e7a8a" />
      <circle cx="210" cy="268" r="18" fill="#a9845c" />
    </svg>
  )
}

export function HaramScene() {
  return (
    <svg viewBox="0 0 390 260" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="haram-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d4a6b" />
          <stop offset="55%" stopColor="#8a6a7a" />
          <stop offset="100%" stopColor="#e8c9b0" />
        </linearGradient>
      </defs>
      <rect width="390" height="260" fill="url(#haram-sky)" />
      <circle cx="48" cy="36" r="2" fill="#fff8e8" />
      <circle cx="90" cy="22" r="1.5" fill="#fff8e8" />
      <circle cx="310" cy="30" r="1.8" fill="#fff8e8" />
      <circle cx="350" cy="48" r="1.4" fill="#fff8e8" />
      <ellipse cx="195" cy="188" rx="150" ry="46" fill="#f4ece2" />
      <ellipse cx="195" cy="188" rx="118" ry="34" fill="#efe4d4" />
      <ellipse cx="195" cy="188" rx="78" ry="22" fill="#e6d9c6" />
      <rect x="168" y="128" width="54" height="58" rx="4" fill="#2b241f" />
      <rect x="168" y="150" width="54" height="7" fill="#c4a35a" />
      <circle cx="120" cy="200" r="3" fill="#6b5c4f" />
      <circle cx="250" cy="206" r="3" fill="#6b5c4f" />
      <circle cx="150" cy="214" r="2.4" fill="#6b5c4f" />
      <circle cx="280" cy="196" r="2.6" fill="#6b5c4f" />
      <circle cx="196" cy="222" r="2.2" fill="#6b5c4f" />
    </svg>
  )
}

export function MiniScene({
  variant,
}: {
  variant: "airport" | "taxi" | "hotel" | "market" | "animals" | "actions" | "home" | "directions" | "pharmacy" | "meeting" | "buying"
}) {
  const colors: Record<string, [string, string]> = {
    airport: ["#d7e6ee", "#7ba8b8"],
    taxi: ["#f3e0b0", "#c4a35a"],
    hotel: ["#ead9c8", "#c4785a"],
    market: ["#e4d5b4", "#6e8b74"],
    animals: ["#dce8c8", "#6e8b74"],
    actions: ["#f0d9c8", "#c4785a"],
    home: ["#e8dcc8", "#8a6a4a"],
    directions: ["#d5e4d4", "#4f6b56"],
    pharmacy: ["#d7ead8", "#6e8b74"],
    meeting: ["#e4d5ea", "#5c4d6b"],
    buying: ["#f3d4c4", "#c4785a"],
  }
  const [from, to] = colors[variant]
  return (
    <div
      className="h-full w-full"
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
      aria-hidden
    />
  )
}
