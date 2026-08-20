import { useId } from "react"
import { missionImageSrc, missionSceneImage } from "@/data/learning/mission-images"
import { cn } from "@/lib/utils"
import type { MissionScene, DirectionAction, SceneFocus } from "@/lib/learning-types"

export const missionScenes: Record<string, MissionScene> = {
  immigration: "immigration",
  "airport-arrival": "airport",
  "find-haram": "haram-gate",
  "enter-haram": "crowd",
  "begin-tawaf": "tawaf",
  "find-zamzam": "zamzam",
  "complete-sai": "sai",
  "lost-group": "lost",
  "taxi-hotel": "taxi",
  "order-dinner": "restaurant",
  barber: "barber",
  "something-wrong": "emergency",
  "day-madinah": "madinah",
  "numbers-everywhere": "numbers",
  "master-navigation": "map",
  "explore-food": "food",
}

export function sceneForExperience(id: string): MissionScene {
  return missionScenes[id] ?? "street"
}

export function arabicDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)] ?? digit)
}

export type ExperienceSceneProps = {
  scene: MissionScene
  missionId?: string
  compact?: boolean
  thumb?: boolean
  gateNumber?: string | number
  complication?: string
  focus?: SceneFocus
  highlight?: DirectionAction | "arrive"
  interactive?: boolean
  availableDirections?: DirectionAction[]
  selectedDirection?: DirectionAction | null
  correctDirection?: DirectionAction
  onChooseDirection?: (direction: DirectionAction) => void
  className?: string
}

export function ExperienceScene({
  scene,
  missionId,
  compact,
  thumb,
  gateNumber,
  complication,
  focus = "place",
  highlight,
  interactive,
  availableDirections,
  selectedDirection,
  correctDirection,
  onChooseDirection,
  className,
}: ExperienceSceneProps) {
  const height = thumb ? "h-full" : compact ? "h-28" : "h-48"
  const streetLike = scene === "haram-gate" || scene === "street" || scene === "crowd"
  const src = missionId ? missionSceneImage(missionId, true) : undefined
  const usePhoto = Boolean(src) && !interactive

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-border/80",
        height,
        className,
      )}
      dir="ltr"
    >
      {src && usePhoto ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : streetLike ? (
        <StreetScene
          crowd={scene === "crowd"}
          gateNumber={gateNumber}
          complication={complication}
          focus={focus}
          highlight={highlight}
          selectedDirection={selectedDirection}
          correctDirection={correctDirection}
        />
      ) : (
        <SceneArt scene={scene} highlight={highlight} />
      )}
      {interactive && streetLike ? (
        <DirectionHits
          options={availableDirections ?? ["left", "right", "straight", "up"]}
          selected={selectedDirection}
          correct={correctDirection}
          onChoose={onChooseDirection}
        />
      ) : null}
    </div>
  )
}

export function SceneMark({
  scene,
  missionId,
  className,
}: {
  scene: MissionScene
  missionId?: string
  className?: string
}) {
  const src = missionId ? missionImageSrc[missionId] : undefined
  return (
    <div className={cn("overflow-hidden rounded-full", className)}>
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <SceneArt scene={scene === "haram-gate" || scene === "street" ? "haram-gate" : scene} mark />
      )}
    </div>
  )
}

function DirectionHits({
  options,
  selected,
  correct,
  onChoose,
}: {
  options: DirectionAction[]
  selected?: DirectionAction | null
  correct?: DirectionAction
  onChoose?: (direction: DirectionAction) => void
}) {
  const areas: { id: DirectionAction; label: string; className: string }[] = [
    { id: "left", label: "Go left", className: "left-[4%] top-[40%] h-[54%] w-[28%]" },
    { id: "straight", label: "Go straight", className: "left-[36%] top-[32%] h-[62%] w-[28%]" },
    { id: "right", label: "Go right", className: "left-[67%] top-[40%] h-[54%] w-[28%]" },
    { id: "up", label: "Go upstairs", className: "right-[3%] top-[6%] h-[34%] w-[22%]" },
  ]

  return (
    <>
      {areas
        .filter((area) => options.includes(area.id))
        .map((area) => {
          const isSelected = selected === area.id
          const isCorrect = area.id === correct
          return (
            <button
              key={area.id}
              type="button"
              aria-label={area.label}
              onClick={() => onChoose?.(area.id)}
              className={cn(
                "absolute rounded-[1.25rem] border-2 border-transparent",
                area.className,
                isSelected && isCorrect && "border-sage bg-sage/15",
                isSelected && !isCorrect && "border-destructive/50 bg-destructive/10",
                !isSelected && "hover:border-white/50 hover:bg-white/10",
              )}
            />
          )
        })}
    </>
  )
}

function StreetScene({
  crowd,
  gateNumber,
  complication,
  focus,
  highlight,
  selectedDirection,
  correctDirection,
}: {
  crowd?: boolean
  gateNumber?: string | number
  complication?: string
  focus: SceneFocus
  highlight?: DirectionAction | "arrive"
  selectedDirection?: DirectionAction | null
  correctDirection?: DirectionAction
}) {
  const uid = useId().replace(/:/g, "")
  const gate = gateNumber ? arabicDigits(gateNumber) : "٧٩"
  const chosen = selectedDirection && selectedDirection === correctDirection ? selectedDirection : highlight
  const walkerX = chosen === "left" ? 68 : chosen === "right" ? 292 : chosen === "up" ? 318 : 180

  return (
    <svg viewBox="0 0 360 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={crowd ? "#d7c4b0" : "#f0e4cc"} />
          <stop offset="55%" stopColor={crowd ? "#c9b49a" : "#e4d2b4"} />
          <stop offset="100%" stopColor="#cbb89a" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill={`url(#${uid}-sky)`} />
      <circle cx="300" cy="28" r="16" fill="#f8e7a8" opacity="0.85" />

      <rect x="8" y="52" width="70" height="90" fill="#d8c4a6" />
      <rect x="86" y="40" width="52" height="102" fill="#cbb59a" />
      <rect x="228" y="46" width="58" height="96" fill="#d2bea0" />
      <rect x="292" y="22" width="60" height="120" fill="#c4ae90" />

      <path d="M18 186 V112 Q68 58 118 112 V186 Z" fill={fillFor("left", chosen)} stroke={strokeFor("left", chosen, focus)} strokeWidth="3" />
      <path d="M130 186 V98 Q180 42 230 98 V186 Z" fill={fillFor("straight", chosen)} stroke={strokeFor("straight", chosen, focus)} strokeWidth="3.5" />
      <path d="M242 186 V112 Q292 58 342 112 V186 Z" fill={fillFor("right", chosen)} stroke={strokeFor("right", chosen, focus)} strokeWidth="3" />

      <rect x="308" y="78" width="36" height="8" fill="#b9a486" />
      <rect x="312" y="66" width="28" height="8" fill="#c4b090" />
      <rect x="316" y="54" width="20" height="8" fill="#d0bea0" />
      <rect x="320" y="42" width="12" height="8" fill="#d8c8ac" />

      <path d="M0 186 H360 L360 200 H0 Z" fill="#b9a078" />
      <path d="M0 186 H360" stroke="#a88b68" strokeWidth="3" />

      <rect
        x="24"
        y="44"
        width="58"
        height="30"
        rx="4"
        fill={focus === "plaque" ? "#fff8ee" : "#f4ece2"}
        stroke={focus === "plaque" ? "#c4785a" : "#c4a35a"}
        strokeWidth={focus === "plaque" ? 2.5 : 1.5}
      />
      <text x="53" y="57" textAnchor="middle" fontSize="9" fill="#6b5c4f" fontFamily="Noto Sans Arabic, sans-serif">
        باب
      </text>
      <text x="53" y="70" textAnchor="middle" fontSize="12" fill="#3a2f26" fontWeight="700" fontFamily="Noto Sans Arabic, sans-serif">
        {gate}
      </text>

      <g transform="translate(108,138)" opacity={focus === "guard" ? 1 : 0.92}>
        {focus === "guard" ? <circle cx="10" cy="8" r="18" fill="rgba(196,120,90,0.18)" /> : null}
        <circle cx="10" cy="4" r="6" fill="#e8d5c4" />
        <rect x="3" y="10" width="14" height="18" rx="4" fill="#f7f1e8" />
        <rect x="5" y="28" width="4" height="10" fill="#d8c4a6" />
        <rect x="11" y="28" width="4" height="10" fill="#d8c4a6" />
      </g>

      {crowd ? (
        <>
          <circle cx="48" cy="176" r="4" fill="#6b5c4f" />
          <circle cx="62" cy="180" r="3.2" fill="#8a6a4a" />
          <circle cx="160" cy="178" r="4" fill="#5c4d6b" />
          <circle cx="176" cy="182" r="3.4" fill="#6b5c4f" />
          <circle cx="198" cy="176" r="3.6" fill="#4f6b56" />
          <circle cx="268" cy="180" r="4" fill="#6b5c4f" />
          <circle cx="284" cy="176" r="3" fill="#8a6a4a" />
        </>
      ) : (
        <>
          <circle cx="150" cy="180" r="3" fill="#6b5c4f" />
          <circle cx="210" cy="182" r="2.6" fill="#8a6a4a" />
        </>
      )}

      {complication === "closed" ? (
        <g>
          <rect x="142" y="118" width="76" height="10" rx="2" fill="#b54a3c" />
          <text x="180" y="108" textAnchor="middle" fontSize="11" fill="#b54a3c" fontWeight="700">
            مغلق
          </text>
        </g>
      ) : null}
      {complication === "women" ? (
        <text x="292" y="104" textAnchor="middle" fontSize="12" fill="#5c4d6b" fontWeight="700">
          نساء
        </text>
      ) : null}
      {complication === "families" ? (
        <text x="68" y="104" textAnchor="middle" fontSize="11" fill="#4e7a8a" fontWeight="700">
          عائلات
        </text>
      ) : null}
      {complication === "floor" || chosen === "up" ? (
        <text x="328" y="36" textAnchor="middle" fontSize="10" fill="#4f6b56" fontWeight="700">
          فوق
        </text>
      ) : null}

      <circle cx={walkerX} cy="190" r="5" fill="#c4785a" />
      <circle cx={walkerX} cy="182" r="3.2" fill="#e8d5c4" />
    </svg>
  )
}

function fillFor(direction: DirectionAction, chosen?: DirectionAction | "arrive") {
  if (chosen === direction) return "rgba(111,139,116,0.45)"
  return "rgba(255,253,248,0.62)"
}

function strokeFor(direction: DirectionAction, chosen: DirectionAction | "arrive" | undefined, focus: SceneFocus) {
  if (chosen === direction) return "#4f6b56"
  if (focus === "doors" || focus === "stairs") return "rgba(58,47,38,0.35)"
  return "rgba(58,47,38,0.22)"
}

function SceneArt({
  scene,
  highlight,
  mark,
}: {
  scene: MissionScene
  highlight?: DirectionAction | "arrive"
  mark?: boolean
}) {
  const uid = useId().replace(/:/g, "")
  const box = mark ? "0 0 80 80" : "0 0 360 200"

  if (scene === "map") {
    return <MiniMap highlight={highlight} className="h-full w-full" />
  }

  return (
    <svg viewBox={box} className="h-full w-full" aria-hidden>
      {scene === "immigration" ? <ImmigrationArt uid={uid} mark={mark} /> : null}
      {scene === "airport" || scene === "packing" ? <AirportArt uid={uid} mark={mark} /> : null}
      {scene === "taxi" || scene === "hotel-lobby" ? <TaxiArt uid={uid} mark={mark} /> : null}
      {scene === "restaurant" || scene === "food" || scene === "market" || scene === "hotel-room" ? (
        <TableArt uid={uid} mark={mark} extra={scene === "food" || scene === "market"} />
      ) : null}
      {scene === "tawaf" || scene === "haram-courtyard" ? <TawafArt uid={uid} mark={mark} /> : null}
      {scene === "zamzam" ? <ZamzamArt uid={uid} mark={mark} /> : null}
      {scene === "sai" ? <SaiArt uid={uid} mark={mark} /> : null}
      {scene === "barber" ? <BarberArt uid={uid} mark={mark} /> : null}
      {scene === "bus" ? <BusArt uid={uid} mark={mark} /> : null}
      {scene === "lost" ? <LostArt uid={uid} mark={mark} /> : null}
      {scene === "madinah" || scene === "nabawi-courtyard" ? <MadinahArt uid={uid} mark={mark} /> : null}
      {scene === "emergency" || scene === "pharmacy" ? <EmergencyArt uid={uid} mark={mark} /> : null}
      {scene === "numbers" || scene === "clock" ? <NumbersArt uid={uid} mark={mark} /> : null}
      {scene === "haram-gate" || scene === "street" || scene === "crowd" ? (
        <GateMark crowd={scene === "crowd"} />
      ) : null}
    </svg>
  )
}

function GateMark({ crowd }: { crowd?: boolean }) {
  return (
    <g>
      <rect width="80" height="80" fill={crowd ? "#d7c4b0" : "#f0e4cc"} />
      <path d="M8 70 V42 Q20 22 32 42 V70 Z" fill="#fffdf8" stroke="#3a2f26" strokeWidth="1.4" />
      <path d="M30 70 V36 Q40 14 50 36 V70 Z" fill="#fffdf8" stroke="#3a2f26" strokeWidth="1.6" />
      <path d="M48 70 V42 Q60 22 72 42 V70 Z" fill="#fffdf8" stroke="#3a2f26" strokeWidth="1.4" />
      <circle cx="40" cy="74" r="3.5" fill="#c4785a" />
    </g>
  )
}

function ImmigrationArt({ uid, mark }: { uid: string; mark?: boolean }) {
  if (mark) {
    return (
      <g>
        <rect width="80" height="80" fill="#f0e4cc" />
        <rect x="8" y="8" width="64" height="36" rx="4" fill="#d5e3ea" />
        <rect x="18" y="14" width="44" height="24" rx="3" fill="#fffdf8" stroke="#c4785a" strokeWidth="2" />
        <rect x="22" y="18" width="14" height="16" rx="1.5" fill="#efe4d4" />
        <circle cx="29" cy="16" r="4" fill="#e8d5c4" />
        <rect x="40" y="22" width="16" height="10" rx="1" fill="#6e8b74" opacity="0.35" />
        <rect x="10" y="46" width="60" height="22" rx="3" fill="#6b7c86" />
        <rect x="16" y="52" width="22" height="12" rx="1.5" fill="#fffdf8" stroke="#3a2f26" strokeWidth="1" />
        <rect x="42" y="54" width="14" height="10" rx="1" fill="#c4a35a" />
        <circle cx="56" cy="59" r="3" fill="#c4785a" />
      </g>
    )
  }

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-i-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4eef3" />
          <stop offset="55%" stopColor="#d2e0e8" />
          <stop offset="100%" stopColor="#f0e4cc" />
        </linearGradient>
        <linearGradient id={`${uid}-i-desk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a8b94" />
          <stop offset="100%" stopColor="#5c6b74" />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill={`url(#${uid}-i-sky)`} />
      {/* Hall wall strip */}
      <rect x="0" y="118" width="360" height="82" fill="#efe4d4" />
      {/* Counter booth window */}
      <rect x="108" y="28" width="144" height="92" rx="8" fill="#fffdf8" stroke="#c4785a" strokeWidth="3" />
      <rect x="116" y="36" width="128" height="56" rx="4" fill="#d8e6ed" />
      {/* Faceless officer */}
      <circle cx="180" cy="52" r="14" fill="#e8d5c4" />
      <rect x="160" y="64" width="40" height="28" rx="6" fill="#6e8b74" />
      {/* Desk counter */}
      <rect x="40" y="120" width="280" height="56" rx="6" fill={`url(#${uid}-i-desk)`} />
      <rect x="40" y="114" width="280" height="10" rx="3" fill="#8a9aa3" />
      {/* Open passport */}
      <rect x="78" y="128" width="52" height="36" rx="3" fill="#fffdf8" stroke="#3a2f26" strokeWidth="1.5" />
      <line x1="104" y1="128" x2="104" y2="164" stroke="#e6d9c6" strokeWidth="2" />
      <rect x="84" y="136" width="14" height="8" rx="1" fill="#efe4d4" />
      <rect x="110" y="136" width="14" height="8" rx="1" fill="#efe4d4" />
      {/* Stamp pad + stamp */}
      <rect x="220" y="136" width="36" height="24" rx="3" fill="#c4a35a" />
      <circle cx="270" cy="148" r="10" fill="#c4785a" />
      <circle cx="270" cy="148" r="5" fill="#b4684c" />
    </g>
  )
}

function AirportArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7e6ee" />
          <stop offset="100%" stopColor="#9bb8c4" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-a)`} />
      <path
        d={mark ? "M12 48 L40 22 L68 48 L58 48 L58 58 L22 58 L22 48 Z" : "M60 140 L180 70 L300 140 L250 140 L250 168 L110 168 L110 140 Z"}
        fill="#fffdf8"
        stroke="#3a2f26"
        strokeWidth="1.4"
      />
      <rect x={mark ? 34 : 168} y={mark ? 40 : 118} width={mark ? 12 : 28} height={mark ? 18 : 40} fill="#4e7a8a" />
    </g>
  )
}

function TaxiArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <rect width="100%" height="100%" fill={`url(#${uid}-t)`} />
      <defs>
        <linearGradient id={`${uid}-t`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dce6d8" />
          <stop offset="100%" stopColor="#b7c7b4" />
        </linearGradient>
      </defs>
      <path d={mark ? "M8 52 H72" : "M20 150 H340"} stroke="#9bb0a4" strokeWidth={mark ? 10 : 18} />
      <rect x={mark ? 18 : 110} y={mark ? 28 : 96} width={mark ? 46 : 150} height={mark ? 22 : 44} rx={mark ? 8 : 16} fill="#c4a35a" />
      <rect x={mark ? 28 : 148} y={mark ? 18 : 78} width={mark ? 26 : 74} height={mark ? 14 : 24} rx="4" fill="#e8f0e6" />
      <circle cx={mark ? 28 : 142} cy={mark ? 52 : 142} r={mark ? 6 : 12} fill="#3a2f26" />
      <circle cx={mark ? 54 : 228} cy={mark ? 52 : 142} r={mark ? 6 : 12} fill="#3a2f26" />
    </g>
  )
}

function TableArt({ uid, mark, extra }: { uid: string; mark?: boolean; extra?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3e2c8" />
          <stop offset="100%" stopColor="#e0c8a4" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-r)`} />
      <ellipse cx={mark ? 40 : 180} cy={mark ? 48 : 128} rx={mark ? 28 : 110} ry={mark ? 16 : 48} fill="#c4a07a" />
      <circle cx={mark ? 32 : 140} cy={mark ? 44 : 118} r={mark ? 7 : 18} fill="#efe4d4" />
      <circle cx={mark ? 48 : 200} cy={mark ? 46 : 122} r={mark ? 8 : 22} fill="#d9845e" />
      <rect x={mark ? 54 : 230} y={mark ? 34 : 96} width={mark ? 8 : 18} height={mark ? 14 : 28} rx="3" fill="#7ba8b8" />
      {extra ? <circle cx={mark ? 40 : 176} cy={mark ? 58 : 150} r={mark ? 5 : 12} fill="#6e8b74" /> : null}
    </g>
  )
}

function TawafArt({ uid, mark }: { uid: string; mark?: boolean }) {
  const cx = mark ? 40 : 180
  const cy = mark ? 42 : 108
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-k`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d4a6b" />
          <stop offset="100%" stopColor="#e8c9b0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-k)`} />
      <ellipse cx={cx} cy={cy + (mark ? 8 : 28)} rx={mark ? 28 : 120} ry={mark ? 12 : 36} fill="#f4ece2" />
      <ellipse cx={cx} cy={cy + (mark ? 8 : 28)} rx={mark ? 20 : 86} ry={mark ? 8 : 24} fill="#efe4d4" />
      <rect x={cx - (mark ? 7 : 22)} y={cy - (mark ? 10 : 28)} width={mark ? 14 : 44} height={mark ? 16 : 40} fill="#2b241f" />
      <rect x={cx - (mark ? 7 : 22)} y={cy - (mark ? 2 : 8)} width={mark ? 14 : 44} height={mark ? 3 : 6} fill="#c4a35a" />
    </g>
  )
}

function ZamzamArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-z`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7e4ea" />
          <stop offset="100%" stopColor="#b7cdd6" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-z)`} />
      <rect x={mark ? 28 : 150} y={mark ? 22 : 70} width={mark ? 24 : 60} height={mark ? 28 : 70} rx="6" fill="#eef5f7" stroke="#7ba8b8" />
      <path
        d={mark ? "M40 18 Q44 28 40 34 Q36 28 40 18" : "M180 52 Q196 78 180 96 Q164 78 180 52"}
        fill="#7ba8b8"
        opacity="0.7"
      />
      <ellipse cx={mark ? 40 : 180} cy={mark ? 58 : 150} rx={mark ? 16 : 40} ry={mark ? 5 : 10} fill="#6ea0b0" opacity="0.4" />
    </g>
  )
}

function SaiArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ead9c4" />
          <stop offset="100%" stopColor="#c4b39a" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-s)`} />
      <path d={mark ? "M8 58 Q22 18 40 58 Z" : "M40 170 Q110 40 180 170 Z"} fill="#cbb59a" />
      <path d={mark ? "M40 58 Q58 22 74 58 Z" : "M180 170 Q250 48 320 170 Z"} fill="#d8c4a6" />
      <path d={mark ? "M16 62 H64" : "M70 176 H290"} stroke="#c4785a" strokeWidth={mark ? 3 : 6} strokeDasharray="6 6" />
    </g>
  )
}

function BarberArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#efe4d0" />
          <stop offset="100%" stopColor="#d8c7a8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-b)`} />
      <rect x={mark ? 26 : 140} y={mark ? 36 : 110} width={mark ? 28 : 80} height={mark ? 22 : 50} rx="6" fill="#6b5c4f" />
      <rect x={mark ? 32 : 158} y={mark ? 18 : 70} width={mark ? 16 : 44} height={mark ? 22 : 50} rx="8" fill="#f7f1e8" />
      <circle cx={mark ? 40 : 180} cy={mark ? 16 : 62} r={mark ? 7 : 16} fill="#e8d5c4" />
      <path d={mark ? "M58 22 L70 34 M70 22 L58 34" : "M250 70 L290 110 M290 70 L250 110"} stroke="#c4785a" strokeWidth="3" />
    </g>
  )
}

function BusArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-u`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7e6ee" />
          <stop offset="100%" stopColor="#7ba8b8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-u)`} />
      <rect x={mark ? 12 : 70} y={mark ? 24 : 80} width={mark ? 56 : 220} height={mark ? 28 : 70} rx="8" fill="#4e7a8a" />
      <rect x={mark ? 18 : 90} y={mark ? 28 : 90} width={mark ? 12 : 36} height={mark ? 10 : 24} fill="#e8f0e6" />
      <rect x={mark ? 34 : 140} y={mark ? 28 : 90} width={mark ? 12 : 36} height={mark ? 10 : 24} fill="#e8f0e6" />
      <circle cx={mark ? 24 : 120} cy={mark ? 56 : 154} r={mark ? 6 : 12} fill="#3a2f26" />
      <circle cx={mark ? 56 : 250} cy={mark ? 56 : 154} r={mark ? 6 : 12} fill="#3a2f26" />
    </g>
  )
}

function LostArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4d5ea" />
          <stop offset="100%" stopColor="#c4b8c8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-l)`} />
      <circle cx={mark ? 24 : 90} cy={mark ? 48 : 130} r={mark ? 4 : 8} fill="#6b5c4f" />
      <circle cx={mark ? 58 : 260} cy={mark ? 30 : 90} r={mark ? 4 : 8} fill="#6b5c4f" />
      <circle cx={mark ? 44 : 180} cy={mark ? 40 : 110} r={mark ? 6 : 12} fill="#c4785a" />
      <text x={mark ? 44 : 180} y={mark ? 22 : 70} textAnchor="middle" fontSize={mark ? 16 : 28} fill="#5c4d6b">
        ؟
      </text>
    </g>
  )
}

function MadinahArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c5ddd4" />
          <stop offset="100%" stopColor="#e8dcc8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-m)`} />
      <rect x={mark ? 22 : 120} y={mark ? 36 : 100} width={mark ? 36 : 120} height={mark ? 22 : 50} fill="#efe4d4" />
      <circle cx={mark ? 40 : 180} cy={mark ? 30 : 88} r={mark ? 14 : 36} fill="#4f6b56" />
      <rect x={mark ? 54 : 230} y={mark ? 18 : 48} width={mark ? 5 : 12} height={mark ? 28 : 70} fill="#c4a35a" />
    </g>
  )
}

function EmergencyArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-e`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d4c4" />
          <stop offset="100%" stopColor="#e0b8a8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-e)`} />
      <rect x={mark ? 34 : 164} y={mark ? 18 : 60} width={mark ? 12 : 32} height={mark ? 44 : 90} rx="4" fill="#b54a3c" />
      <rect x={mark ? 18 : 128} y={mark ? 34 : 92} width={mark ? 44 : 104} height={mark ? 12 : 28} rx="4" fill="#b54a3c" />
    </g>
  )
}

function NumbersArt({ uid, mark }: { uid: string; mark?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-n`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efe4d0" />
          <stop offset="100%" stopColor="#d8c7a8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-n)`} />
      <rect x={mark ? 14 : 70} y={mark ? 22 : 70} width={mark ? 22 : 70} height={mark ? 28 : 70} rx="6" fill="#f4ece2" stroke="#c4a35a" />
      <rect x={mark ? 44 : 160} y={mark ? 22 : 70} width={mark ? 22 : 70} height={mark ? 28 : 70} rx="6" fill="#f4ece2" stroke="#c4a35a" />
      <text x={mark ? 25 : 105} y={mark ? 42 : 116} textAnchor="middle" fontSize={mark ? 12 : 22} fill="#3a2f26">
        ٧
      </text>
      <text x={mark ? 55 : 195} y={mark ? 42 : 116} textAnchor="middle" fontSize={mark ? 12 : 22} fill="#3a2f26">
        ١٢
      </text>
    </g>
  )
}

export function MiniMap({
  highlight,
  className,
}: {
  highlight?: DirectionAction | "arrive"
  className?: string
}) {
  return (
    <svg viewBox="0 0 260 160" className={cn("h-full w-full", className)} aria-hidden>
      <rect x="8" y="8" width="244" height="144" rx="18" fill="#eef5f7" stroke="#c5d5dc" />
      <path d="M40 120 H130 V40 H220" fill="none" stroke="#9bb0b8" strokeWidth="14" strokeLinecap="round" />
      <circle cx="40" cy="120" r="8" fill="#c4785a" />
      <rect x="200" y="28" width="28" height="22" rx="4" fill="#c4a35a" />
      {highlight === "right" ? <path d="M130 120 H170" stroke="#4f6b56" strokeWidth="8" /> : null}
      {highlight === "left" ? <path d="M130 80 H90" stroke="#4f6b56" strokeWidth="8" /> : null}
      {highlight === "straight" ? <path d="M130 120 V70" stroke="#4f6b56" strokeWidth="8" /> : null}
      {highlight === "up" ? <path d="M130 80 V40" stroke="#4f6b56" strokeWidth="8" /> : null}
      {highlight === "arrive" || highlight === "stop" ? <circle cx="220" cy="40" r="12" fill="#4f6b56" /> : null}
    </svg>
  )
}
