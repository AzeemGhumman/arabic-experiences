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
  | "hajj-locations"
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

export type AdventureType =
  | "navigation"
  | "recognition"
  | "conversation"
  | "transaction"
  | "ritual-navigation"
  | "emergency"

export type AdventurePoolRequest = {
  poolId: string
  count: number
  required?: boolean
}

export type AdventureComplication = {
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
  scene?: AdventureScene
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

export type AdventureStep =
  | {
      type: "context"
      title: string
      body: string
      scene: AdventureScene
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

export type AdventureScene =
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

export type SceneFocus = "place" | "guard" | "plaque" | "doors" | "stairs"

export type Adventure = {
  id: string
  title: string
  subtitle: string
  description: string
  journeyId: "umrah" | "hajj" | "travel"
  chapterId: string
  type: AdventureType
  capabilityRewards: Partial<Record<CapabilityId, number>>
  requiredPools: AdventurePoolRequest[]
  optionalPools?: AdventurePoolRequest[]
  complications: AdventureComplication[]
  sideMissionIds: string[]
  estimatedMinutes: number
  replayable?: boolean
  playable: boolean
  canNowDo: string
  buildRun?: (ctx: AdventureBuildContext) => AdventureRun
}

export type AdventureBuildContext = {
  rand: () => number
  capabilities: Record<string, number>
  pickFromPool: (poolId: string, count: number) => LearningWord[]
  word: (id: string) => LearningWord
}

export type AdventureRun = {
  id: string
  adventureId: string
  seed: string
  selectedVocabularyIds: string[]
  selectedComplicationId?: string
  variables: Record<string, string | number>
  steps: AdventureStep[]
  outcome: string
  advanced?: boolean
}

export type SideMission = {
  id: string
  title: string
  eyebrow: string
  description: string
  unlockAfterAdventureIds: string[]
  vocabularyGain: number
  estimatedMinutes: number
  capabilityId: CapabilityId
  capabilityLevel: number
  playable: boolean
  canNowDo: string
  buildRun?: (ctx: AdventureBuildContext) => AdventureRun
}

export type CapabilityDef = {
  id: CapabilityId
  title: string
  depths: [string, string, string]
}
