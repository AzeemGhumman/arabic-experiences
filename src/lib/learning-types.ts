export type CapabilityId =
  | "navigation"
  | "numbers"
  | "food"
  | "money"
  | "family"
  | "transportation"
  | "hotel"
  | "emergency"
  | "health"
  | "haram"
  | "time"

export type VocabularyKind =
  | "word"
  | "phrase"
  | "instruction"
  | "question-pattern"
  | "ritual-term"

export type Register = "msa" | "saudi-colloquial" | "shared"

export type LearningWord = {
  id: string
  arabic: string
  transliteration: string
  /** UI explanation. Later: `{ en, ur, ... }`. */
  meaning: string
  kind: VocabularyKind
  domains: string[]
  pools: string[]
  difficulty: 1 | 2 | 3
  register?: Register
  notes?: string
}

export type VocabularyPool = {
  id: string
  title: string
  description: string
  vocabularyIds: string[]
  capabilityId?: CapabilityId
  depth: 1 | 2 | 3
}

export type MissionType =
  | "navigation"
  | "recognition"
  | "conversation"
  | "transaction"
  | "ritual-navigation"
  | "emergency"

export type MissionPoolRequest = {
  poolId: string
  count: number
  required?: boolean
}

export type MissionComplication = {
  id: string
  title: string
  description?: string
  requiredVocabularyIds?: string[]
}

export type ChoiceOption = {
  id: string
  label: string
  arabic?: string
}

export type StudyGroup = {
  title: string
  intro?: string
  scene?: MissionScene
  vocabIds: string[]
}

export type StudyResourceKind = "website" | "youtube" | "pdf"

export type StudyResource = {
  title: string
  url: string
  kind: StudyResourceKind
  /** Publisher or authority behind the resource. */
  source: string
  note?: string
  /** Inline YouTube player — single video. */
  youtubeVideoId?: string
  /** Inline YouTube player — playlist (used when no video id). */
  youtubePlaylistId?: string
}

export type MissionStep =
  | {
      type: "context"
      title: string
      body: string
      scene: MissionScene
    }
  | {
      type: "discover"
      prompt: string
      vocabIds: string[]
    }
  | {
      type: "study"
      groups: StudyGroup[]
    }
  | {
      type: "choice"
      prompt: string
      arabic?: string
      options: ChoiceOption[]
      correctId: string
      feedback?: string
    }
  | {
      type: "direction"
      prompt: string
      arabic: string
      options: DirectionAction[]
      correct: DirectionAction
    }
  | {
      type: "phrase"
      prompt: string
      tokens: string[]
      correctOrder: string[]
    }
  | {
      type: "listen"
      prompt: string
      arabic: string
      /** Clip id within the mission audio pack. */
      audioId?: string
      options: ChoiceOption[]
      correctId: string
    }
  | {
      type: "decision"
      prompt: string
      situation: string
      options: ChoiceOption[]
      correctId: string
      feedback?: string
    }
  | {
      type: "gps"
      prompt: string
      instructions: GpsInstruction[]
    }

export type DirectionAction = "left" | "right" | "straight" | "up" | "down" | "stop"

export type GpsInstruction = {
  arabic: string
  meaning: string
  action: DirectionAction | "arrive"
  /** Clip id within the mission audio pack. */
  audioId?: string
}

export type MissionScene =
  | "street"
  | "haram-gate"
  | "crowd"
  | "taxi"
  | "restaurant"
  | "map"
  | "numbers"
  | "food"
  | "tawaf"
  | "zamzam"
  | "sai"
  | "barber"
  | "bus"
  | "lost"
  | "madinah"
  | "emergency"
  | "airport"
  | "immigration"
  | "hotel-lobby"
  | "hotel-room"
  | "market"
  | "packing"
  | "pharmacy"
  | "haram-courtyard"
  | "nabawi-courtyard"
  | "clock"

export type SceneFocus = "place" | "guard" | "plaque" | "doors" | "stairs"

export type Mission = {
  id: string
  title: string
  subtitle: string
  description: string
  journeyId: "umrah" | "travel"
  /** Chapter on the map. Match `Chapter.id`: arrival, makkah, madinah. */
  chapterId: string
  type: MissionType
  capabilityRewards: Partial<Record<CapabilityId, number>>
  requiredPools: MissionPoolRequest[]
  optionalPools?: MissionPoolRequest[]
  complications: MissionComplication[]
  /** Study lessons this mission links to — not map side missions. */
  lessonIds: string[]
  estimatedMinutes: number
  replayable?: boolean
  playable: boolean
  canNowDo: string
  buildRun?: (ctx: MissionBuildContext) => MissionRun
}

export type MissionBuildContext = {
  rand: () => number
  capabilities: Record<string, number>
  pickFromPool: (poolId: string, count: number) => LearningWord[]
  word: (id: string) => LearningWord
}

export type MissionRun = {
  id: string
  missionId: string
  seed: string
  selectedVocabularyIds: string[]
  selectedComplicationId?: string
  variables: Record<string, string | number>
  steps: MissionStep[]
  outcome: string
  advanced?: boolean
}

/** Topic bucket for the Study catalog, e.g. numbers, navigation, colors. */
export type TopicId =
  | "numbers"
  | "navigation"
  | "food"
  | "colors"
  | "money"
  | "hotel"
  | "haram"
  | "polite"
  | "packing"
  | "barber"
  | "shopping"
  | "health"
  | "nabawi"
  | "ritual"
  | "time"
  | "clothes"
  | "body"
  | "family"
  | "adjectives"
  | "geography"
  | "nature"
  | "actions"
  | "transport"
  | "airport"
  | "room-service"

export type Topic = {
  id: TopicId
  title: string
  description: string
  order: number
}

/** A Study word list. Not a map side mission. */
export type Lesson = {
  id: string
  title: string
  eyebrow: string
  description: string
  /** Catalog topic — groups lessons in Study. */
  topicId: TopicId
  /** Order within the topic (1 = first). */
  level: number
  /** Short level name used in titles, e.g. "Basic", "Advanced". */
  levelName: string
  /** Missions this lesson supports. */
  missionIds: string[]
  unlockAfterMissionIds: string[]
  vocabularyGain: number
  estimatedMinutes: number
  capabilityId: CapabilityId
  capabilityLevel: number
  playable: boolean
  canNowDo: string
  buildRun?: (ctx: MissionBuildContext) => MissionRun
}

export type CapabilityDef = {
  id: CapabilityId
  title: string
  depths: [string, string, string]
}
