import { supportedLanguages } from "@/locales"
import type { SupportedLanguage } from "@/locales"
import { isJourneyReleased } from "@/data/journeys"
import { normalizeBookmarks, type VocabBookmark } from "@/lib/bookmarks"

export type { VocabBookmark }

export type JourneyCategory = "umrah" | "hajj" | "arabic" | "quran"

export type JourneyStatus = "not-started" | "in-progress" | "completed" | "coming-soon"

export type Confidence = "new" | "seen" | "recognized" | "confident"

export type UiLanguage = SupportedLanguage

export type Journey = {
  id: string
  title: string
  description: string
  category: JourneyCategory
  progress: number
  status: JourneyStatus
  estimatedMinutes: number
  accent: string
}

export type VocabPhrase = {
  arabic: string
  transliteration: string
  meaning: string
  category?: string | null
}

export type VocabularyItem = {
  id: string
  arabic: string
  transliteration: string
  meaning: string
  category: string
  confidence: Confidence
  quranFrequency?: number
  quranPos?: string
  quranLemma?: string
  ipa?: string
  msaRank?: number
  msaGloss?: string
  phrases?: VocabPhrase[]
  swadeshNo?: number
  sourceScene?: string
  example?: string
  relatedIds?: string[]
}

export type UmrahStep = {
  id: string
  title: string
  subtitle: string
  status: JourneyStatus
  href?: string
}

export type Scenario = {
  id: string
  title: string
  description: string
  setting: string
  status: JourneyStatus
  hotspotCount: number
}

export type Hotspot = {
  id: string
  vocabId: string
  label: string
  x: number
  y: number
  w?: number
  h?: number
  notice?: string
}

export type JourneyProgress = {
  completedAdventureIds: string[]
  completedSideMissionIds: string[]
  capabilities: Record<string, 0 | 1 | 2 | 3>
  adventureOutcomes: Record<string, string>
  adventurePlayCounts: Record<string, number>
  discoveredVocab: string[]
  wordConfidence: Record<string, Confidence>
  bookmarkedVocab: VocabBookmark[]
}

export type AppState = {
  onboardingComplete: boolean
  activeJourneyId: JourneyCategory
  goals: JourneyCategory[]
  language: UiLanguage
  showTransliteration: boolean
  showTranslation: boolean
  journeyProgress: Partial<Record<JourneyCategory, JourneyProgress>>
  completedUmrahSteps: string[]
  completedScenarios: string[]
  restaurantAsked: string[]
  gardenCelebrated: boolean
  practicedSupplications: string[]
  visitCount: number
  mapIntroDismissed: boolean
  mockSignedIn: boolean
}

export const STORAGE_KEY = "arabic-experiences-state"

export function emptyJourneyProgress(): JourneyProgress {
  return {
    completedAdventureIds: [],
    completedSideMissionIds: [],
    capabilities: {},
    adventureOutcomes: {},
    adventurePlayCounts: {},
    discoveredVocab: [],
    wordConfidence: {},
    bookmarkedVocab: [],
  }
}

export const defaultAppState: AppState = {
  onboardingComplete: false,
  activeJourneyId: "umrah",
  goals: [],
  language: "en",
  showTransliteration: false,
  showTranslation: false,
  journeyProgress: {},
  completedUmrahSteps: [],
  completedScenarios: [],
  restaurantAsked: [],
  gardenCelebrated: false,
  practicedSupplications: [],
  visitCount: 1,
  mapIntroDismissed: false,
  mockSignedIn: false,
}

type LegacyState = Partial<AppState> & {
  completedAdventureIds?: string[]
  completedSideMissionIds?: string[]
  capabilities?: Record<string, 0 | 1 | 2 | 3>
  adventureOutcomes?: Record<string, string>
  adventurePlayCounts?: Record<string, number>
  discoveredVocab?: string[]
  wordConfidence?: Record<string, Confidence>
  bookmarkedVocab?: unknown
}

export function getJourneyProgress(state: AppState, journeyId = state.activeJourneyId): JourneyProgress {
  return state.journeyProgress[journeyId] ?? emptyJourneyProgress()
}

export function migrateState(parsed: LegacyState): AppState {
  const base: AppState = {
    ...defaultAppState,
    ...parsed,
    journeyProgress: parsed.journeyProgress ?? {},
  }

  const hasLegacyProgress =
    (parsed.completedAdventureIds?.length ?? 0) > 0 ||
    (parsed.completedSideMissionIds?.length ?? 0) > 0 ||
    (parsed.discoveredVocab?.length ?? 0) > 0

  if (Object.keys(base.journeyProgress).length === 0 && hasLegacyProgress) {
    const id = parsed.activeJourneyId ?? parsed.goals?.[0] ?? "umrah"
    base.activeJourneyId = id
    base.journeyProgress = {
      [id]: {
        completedAdventureIds: parsed.completedAdventureIds ?? [],
        completedSideMissionIds: parsed.completedSideMissionIds ?? [],
        capabilities: parsed.capabilities ?? {},
        adventureOutcomes: parsed.adventureOutcomes ?? {},
        adventurePlayCounts: parsed.adventurePlayCounts ?? {},
        discoveredVocab: parsed.discoveredVocab ?? [],
        wordConfidence: parsed.wordConfidence ?? {},
        bookmarkedVocab: normalizeBookmarks(parsed.bookmarkedVocab),
      },
    }
  }

  if (!base.activeJourneyId) base.activeJourneyId = "umrah"
  if (!isJourneyReleased(base.activeJourneyId)) base.activeJourneyId = "umrah"
  if (!supportedLanguages.includes(base.language)) base.language = "en"
  if (typeof base.mapIntroDismissed !== "boolean") base.mapIntroDismissed = false
  if (typeof base.mockSignedIn !== "boolean") base.mockSignedIn = false
  if (!base.journeyProgress[base.activeJourneyId]) {
    base.journeyProgress = {
      ...base.journeyProgress,
      [base.activeJourneyId]: emptyJourneyProgress(),
    }
  }

  for (const id of Object.keys(base.journeyProgress)) {
    const progress = base.journeyProgress[id as JourneyCategory]
    if (!progress) continue
    base.journeyProgress[id as JourneyCategory] = {
      ...progress,
      bookmarkedVocab: normalizeBookmarks(progress.bookmarkedVocab),
    }
  }

  return base
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultAppState }
    return migrateState(JSON.parse(raw) as LegacyState)
  } catch {
    return { ...defaultAppState }
  }
}

export function saveState(state: AppState) {
  const clean: AppState = {
    onboardingComplete: state.onboardingComplete,
    activeJourneyId: state.activeJourneyId,
    goals: state.goals,
    language: state.language,
    showTransliteration: state.showTransliteration,
    showTranslation: state.showTranslation,
    journeyProgress: state.journeyProgress,
    completedUmrahSteps: state.completedUmrahSteps,
    completedScenarios: state.completedScenarios,
    restaurantAsked: state.restaurantAsked,
    gardenCelebrated: state.gardenCelebrated,
    practicedSupplications: state.practicedSupplications,
    visitCount: state.visitCount,
    mapIntroDismissed: Boolean(state.mapIntroDismissed),
    mockSignedIn: Boolean(state.mockSignedIn),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
}
