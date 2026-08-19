import { useId } from "react"
import { prepTopicImageSrc } from "@/data/learning/prep-topic-images"
import type { PrepTopicId } from "@/lib/learning-types"
import { cn } from "@/lib/utils"

export function PrepTopicPicture({
  topicId,
  className,
}: {
  topicId: PrepTopicId
  className?: string
}) {
  const uid = useId().replace(/:/g, "")
  const src = prepTopicImageSrc[topicId]

  return (
    <div className={cn("overflow-hidden", className)} aria-hidden>
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <TopicArt id={topicId} uid={uid} />
        </svg>
      )}
    </div>
  )
}

function TopicArt({ id, uid }: { id: PrepTopicId; uid: string }) {
  switch (id) {
    case "numbers":
      return (
        <g>
          <Sky uid={uid} from="#efe4d4" to="#d8c4a6" />
          <text x="40" y="52" textAnchor="middle" fontSize="36" fontFamily="serif" fill="#3a2f26">
            ٨
          </text>
        </g>
      )
    case "polite":
      return (
        <g>
          <Sky uid={uid} from="#e8efe6" to="#c5d4c2" />
          <circle cx="28" cy="30" r="8" fill="#e8d5c4" />
          <circle cx="52" cy="30" r="8" fill="#e8d5c4" />
          <path d="M18 58 Q28 44 40 58 Q52 44 62 58" fill="none" stroke="#c4785a" strokeWidth="3" strokeLinecap="round" />
        </g>
      )
    case "packing":
      return (
        <g>
          <Sky uid={uid} from="#efe4d0" to="#d4c2a4" />
          <rect x="18" y="28" width="44" height="32" rx="4" fill="#8a6848" />
          <rect x="32" y="20" width="16" height="10" rx="2" fill="#6b5c4f" />
          <rect x="22" y="36" width="36" height="6" rx="1" fill="#c4a35a" />
        </g>
      )
    case "navigation":
      return (
        <g>
          <Sky uid={uid} from="#d7e6ee" to="#9bb8c4" />
          <circle cx="40" cy="40" r="22" fill="#fffdf8" stroke="#3a2f26" strokeWidth="1.6" />
          <path d="M40 22 L46 40 L40 58 L34 40 Z" fill="#c4785a" />
          <path d="M22 40 H58" stroke="#4e7a8a" strokeWidth="1.2" />
        </g>
      )
    case "transport":
      return (
        <g>
          <Sky uid={uid} from="#dce6d8" to="#b7c7b4" />
          <path d="M6 56 H74" stroke="#9bb0a4" strokeWidth="10" />
          <rect x="16" y="28" width="48" height="22" rx="8" fill="#c4a35a" />
          <rect x="26" y="18" width="28" height="14" rx="4" fill="#e8f0e6" />
          <circle cx="26" cy="52" r="6" fill="#3a2f26" />
          <circle cx="54" cy="52" r="6" fill="#3a2f26" />
        </g>
      )
    case "airport":
      return (
        <g>
          <Sky uid={uid} from="#d7e6ee" to="#9bb8c4" />
          <path d="M10 48 L40 20 L70 48 L58 48 L58 58 L22 58 L22 48 Z" fill="#fffdf8" stroke="#3a2f26" strokeWidth="1.4" />
          <rect x="34" y="40" width="12" height="18" fill="#4e7a8a" />
        </g>
      )
    case "geography":
      return (
        <g>
          <Sky uid={uid} from="#e8c9b0" to="#c4a07a" />
          <path d="M12 58 L28 28 L44 58 Z" fill="#cbb59a" />
          <rect x="48" y="30" width="22" height="28" fill="#fffdf8" stroke="#3a2f26" />
          <circle cx="59" cy="24" r="8" fill="#6e8b74" />
        </g>
      )
    case "hotel":
      return (
        <g>
          <Sky uid={uid} from="#e4d5ea" to="#c4b8c8" />
          <rect x="18" y="16" width="44" height="50" rx="2" fill="#fffdf8" stroke="#3a2f26" />
          <rect x="24" y="24" width="10" height="10" fill="#7ba8b8" />
          <rect x="46" y="24" width="10" height="10" fill="#7ba8b8" />
          <rect x="24" y="40" width="10" height="10" fill="#7ba8b8" />
          <rect x="46" y="40" width="10" height="10" fill="#7ba8b8" />
          <rect x="34" y="50" width="12" height="16" fill="#c4785a" />
        </g>
      )
    case "room-service":
      return (
        <g>
          <Sky uid={uid} from="#f3e2c8" to="#e0c8a4" />
          <rect x="12" y="40" width="56" height="22" rx="4" fill="#efe4d4" />
          <rect x="18" y="28" width="44" height="14" rx="6" fill="#d8c7a8" />
          <rect x="50" y="18" width="16" height="12" rx="2" fill="#7ba8b8" />
        </g>
      )
    case "money":
      return (
        <g>
          <Sky uid={uid} from="#efe4d4" to="#d4c2a4" />
          <circle cx="32" cy="42" r="16" fill="#c4a35a" />
          <circle cx="50" cy="38" r="14" fill="#b89448" />
          <text x="50" y="43" textAnchor="middle" fontSize="12" fill="#3a2f26" fontWeight="700">
            ﷼
          </text>
        </g>
      )
    case "food":
      return (
        <g>
          <Sky uid={uid} from="#f3e2c8" to="#e0c8a4" />
          <ellipse cx="40" cy="48" rx="28" ry="16" fill="#c4a07a" />
          <circle cx="32" cy="44" r="7" fill="#efe4d4" />
          <circle cx="48" cy="46" r="8" fill="#d9845e" />
          <rect x="54" y="34" width="8" height="14" rx="3" fill="#7ba8b8" />
        </g>
      )
    case "shopping":
      return (
        <g>
          <Sky uid={uid} from="#ead9c4" to="#c4b39a" />
          <path d="M24 30 H56 L52 62 H28 Z" fill="#c4785a" />
          <path d="M32 30 Q32 18 40 18 Q48 18 48 30" fill="none" stroke="#3a2f26" strokeWidth="3" />
        </g>
      )
    case "colors":
      return (
        <g>
          <Sky uid={uid} from="#f7f1e8" to="#e8ddd0" />
          <circle cx="28" cy="32" r="12" fill="#c45c4a" />
          <circle cx="52" cy="32" r="12" fill="#4a7a9a" />
          <circle cx="28" cy="54" r="12" fill="#5a8a62" />
          <circle cx="52" cy="54" r="12" fill="#d4a832" />
        </g>
      )
    case "clothes":
      return (
        <g>
          <Sky uid={uid} from="#efe4d0" to="#d8c7a8" />
          <path d="M22 24 L40 18 L58 24 L54 62 H26 Z" fill="#f7f1e8" stroke="#3a2f26" strokeWidth="1.5" />
          <path d="M22 24 L8 40" stroke="#3a2f26" strokeWidth="2" />
          <path d="M58 24 L72 40" stroke="#3a2f26" strokeWidth="2" />
        </g>
      )
    case "time":
      return (
        <g>
          <Sky uid={uid} from="#d7e6ee" to="#b7cdd6" />
          <circle cx="40" cy="40" r="22" fill="#fffdf8" stroke="#3a2f26" strokeWidth="2" />
          <path d="M40 40 L40 24" stroke="#3a2f26" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 40 L52 46" stroke="#c4785a" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )
    case "family":
      return (
        <g>
          <Sky uid={uid} from="#e4d5ea" to="#c4b8c8" />
          <circle cx="26" cy="28" r="7" fill="#e8d5c4" />
          <circle cx="40" cy="24" r="8" fill="#e8d5c4" />
          <circle cx="54" cy="28" r="7" fill="#e8d5c4" />
          <path d="M14 62 Q26 42 40 62 Q54 42 66 62 Z" fill="#6e8b74" />
        </g>
      )
    case "haram":
      return (
        <g>
          <Sky uid={uid} from="#3d4a6b" to="#e8c9b0" />
          <ellipse cx="40" cy="56" rx="28" ry="10" fill="#f4ece2" />
          <rect x="32" y="28" width="16" height="22" fill="#2b241f" />
          <rect x="32" y="40" width="16" height="4" fill="#c4a35a" />
        </g>
      )
    case "ritual":
      return (
        <g>
          <Sky uid={uid} from="#ead9c4" to="#c4b39a" />
          <path d="M8 58 Q22 18 40 58 Z" fill="#cbb59a" />
          <path d="M40 58 Q58 22 74 58 Z" fill="#d8c4a6" />
          <path d="M16 62 H64" stroke="#c4785a" strokeWidth="3" strokeDasharray="6 6" />
        </g>
      )
    case "nabawi":
      return (
        <g>
          <Sky uid={uid} from="#d7e6ee" to="#9bb8c4" />
          <rect x="14" y="40" width="52" height="24" fill="#fffdf8" />
          <path d="M20 40 Q40 12 60 40" fill="#5a8a62" />
          <rect x="36" y="44" width="8" height="20" fill="#c4a35a" />
        </g>
      )
    case "barber":
      return (
        <g>
          <Sky uid={uid} from="#efe4d0" to="#d8c7a8" />
          <circle cx="32" cy="28" r="10" fill="#e8d5c4" />
          <rect x="24" y="38" width="16" height="22" rx="6" fill="#f7f1e8" />
          <path d="M50 22 L70 42 M70 22 L50 42" stroke="#c4785a" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )
    case "health":
      return (
        <g>
          <Sky uid={uid} from="#e8efe6" to="#c5d4c2" />
          <rect x="28" y="16" width="24" height="48" rx="6" fill="#fffdf8" stroke="#6e8b74" strokeWidth="2" />
          <path d="M40 26 V54 M28 40 H52" stroke="#c45c4a" strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    case "body":
      return (
        <g>
          <Sky uid={uid} from="#efe4d4" to="#d8c4a6" />
          <circle cx="40" cy="20" r="8" fill="#e8d5c4" />
          <path d="M40 28 V48 M24 36 H56 M32 48 L24 64 M48 48 L56 64" stroke="#3a2f26" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )
    case "actions":
      return (
        <g>
          <Sky uid={uid} from="#dce6d8" to="#b7c7b4" />
          <circle cx="36" cy="22" r="7" fill="#e8d5c4" />
          <path d="M36 30 L36 46 L24 62 M36 46 L50 62 M36 34 L54 28" stroke="#3a2f26" strokeWidth="3.2" strokeLinecap="round" />
        </g>
      )
    case "adjectives":
      return (
        <g>
          <Sky uid={uid} from="#f7f1e8" to="#e8ddd0" />
          <rect x="12" y="18" width="28" height="44" rx="4" fill="#7ba8b8" />
          <rect x="48" y="38" width="16" height="24" rx="3" fill="#c4a35a" />
        </g>
      )
    case "nature":
      return (
        <g>
          <Sky uid={uid} from="#d7e6ee" to="#f0d9b0" />
          <circle cx="58" cy="22" r="12" fill="#d4a832" />
          <path d="M8 64 Q28 36 40 64 Z" fill="#5a8a62" />
          <ellipse cx="28" cy="58" rx="18" ry="8" fill="#6e8b74" opacity="0.5" />
        </g>
      )
    case "hajj":
      return (
        <g>
          <Sky uid={uid} from="#ead9c4" to="#c4b39a" />
          <path d="M10 58 L26 28 L42 58 Z" fill="#fffdf8" stroke="#3a2f26" />
          <path d="M38 58 L54 32 L70 58 Z" fill="#efe4d4" stroke="#3a2f26" />
          <rect x="18" y="58" width="44" height="8" fill="#9bb0a4" />
        </g>
      )
  }
}

function Sky({ uid, from, to }: { uid: string; from: string; to: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill={`url(#${uid}-bg)`} />
    </>
  )
}
