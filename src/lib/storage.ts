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

export type JourneyProgress = {
  completedMissionIds: string[]
  completedLessonIds: string[]
  capabilities: Record<string, 0 | 1 | 2 | 3>
  missionOutcomes: Record<string, string>
  missionPlayCounts: Record<string, number>
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
  practicedSupplications: string[]
  visitCount: number
  mapIntroDismissed: boolean
  mockSignedIn: boolean
}

/** New key: previous `arabic-experiences-state` blobs are ignored. */
export const STORAGE_KEY = "arabic-experiences-state-v2"

export function emptyJourneyProgress(): JourneyProgress {
  return {
    completedMissionIds: [],
    completedLessonIds: [],
    capabilities: {},
    missionOutcomes: {},
    missionPlayCounts: {},
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
  practicedSupplications: [],
  visitCount: 1,
  mapIntroDismissed: false,
  mockSignedIn: false,
}

function readJourneyProgress(raw: unknown): JourneyProgress {
  const progress = (raw ?? {}) as Partial<JourneyProgress>
  return {
    completedMissionIds: Array.isArray(progress.completedMissionIds) ? progress.completedMissionIds : [],
    completedLessonIds: Array.isArray(progress.completedLessonIds) ? progress.completedLessonIds : [],
    capabilities: progress.capabilities ?? {},
    missionOutcomes: progress.missionOutcomes ?? {},
    missionPlayCounts: progress.missionPlayCounts ?? {},
    discoveredVocab: progress.discoveredVocab ?? [],
    wordConfidence: progress.wordConfidence ?? {},
    bookmarkedVocab: normalizeBookmarks(progress.bookmarkedVocab),
  }
}

export function getJourneyProgress(state: AppState, journeyId = state.activeJourneyId): JourneyProgress {
  return state.journeyProgress[journeyId] ?? emptyJourneyProgress()
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultAppState }
    const parsed = JSON.parse(raw) as Partial<AppState>
    const journeyProgress: AppState["journeyProgress"] = {}
    for (const [id, progress] of Object.entries(parsed.journeyProgress ?? {})) {
      journeyProgress[id as JourneyCategory] = readJourneyProgress(progress)
    }
    const next: AppState = {
      ...defaultAppState,
      onboardingComplete: Boolean(parsed.onboardingComplete),
      activeJourneyId: parsed.activeJourneyId ?? "umrah",
      goals: parsed.goals ?? [],
      language: parsed.language ?? "en",
      showTransliteration: Boolean(parsed.showTransliteration),
      showTranslation: Boolean(parsed.showTranslation),
      journeyProgress,
      practicedSupplications: parsed.practicedSupplications ?? [],
      visitCount: typeof parsed.visitCount === "number" ? parsed.visitCount : 1,
      mapIntroDismissed: Boolean(parsed.mapIntroDismissed),
      mockSignedIn: Boolean(parsed.mockSignedIn),
    }
    if (!isJourneyReleased(next.activeJourneyId)) next.activeJourneyId = "umrah"
    if (!supportedLanguages.includes(next.language)) next.language = "en"
    if (!next.journeyProgress[next.activeJourneyId]) {
      next.journeyProgress[next.activeJourneyId] = emptyJourneyProgress()
    }
    return next
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
    practicedSupplications: state.practicedSupplications,
    visitCount: state.visitCount,
    mapIntroDismissed: Boolean(state.mapIntroDismissed),
    mockSignedIn: Boolean(state.mockSignedIn),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
}
