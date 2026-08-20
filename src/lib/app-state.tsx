import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { getJourney, isJourneyReleased, journeys } from "@/data/journeys"
import { graphForJourney } from "@/data/learning/mission-graph"
import type { CapabilityId } from "@/lib/learning-types"
import type { AppState, Confidence, JourneyCategory, JourneyProgress } from "@/lib/storage"
import type { VocabBookmark } from "@/lib/bookmarks"
import { toggleBookmarkInList } from "@/lib/bookmarks"
import {
  defaultAppState,
  emptyJourneyProgress,
  getJourneyProgress,
  loadState,
  saveState,
} from "@/lib/storage"

type AppStateContextValue = {
  state: AppState
  completeOnboarding: (journeyId: JourneyCategory) => void
  setActiveJourney: (journeyId: JourneyCategory) => void
  setLanguage: (language: AppState["language"]) => void
  setShowTransliteration: (value: boolean) => void
  setShowTranslation: (value: boolean) => void
  discoverWord: (id: string) => void
  setConfidence: (id: string, confidence: Confidence) => void
  toggleBookmark: (lessonId: string, wordId: string) => void
  setBookmarkedVocab: (items: VocabBookmark[]) => void
  setLessonCompleted: (id: string, completed: boolean) => void
  practiceSupplication: (id: string) => void
  completeMission: (input: {
    id: string
    kind: "mission" | "lesson"
    vocabularyIds: string[]
    rewards?: Partial<Record<CapabilityId, number>>
    capabilityId?: CapabilityId
    capabilityLevel?: number
    outcome: string
  }) => void
  deleteAllData: () => void
  dismissMapIntro: () => void
  setMockSignedIn: (value: boolean) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

function patchActiveProgress(state: AppState, patch: (progress: JourneyProgress) => JourneyProgress): AppState {
  const id = state.activeJourneyId
  const current = getJourneyProgress(state, id)
  const next = patch(current)
  if (next === current) return state
  return {
    ...state,
    journeyProgress: {
      ...state.journeyProgress,
      [id]: next,
    },
  }
}

export function missionStats(journeyId: JourneyCategory, progress: JourneyProgress) {
  const graph = graphForJourney(journeyId)
  if (graph) {
    const done = graph.nodes.filter(
      (node) =>
        progress.completedMissionIds.includes(node.id),
    ).length
    return { done, total: graph.nodes.length, percent: Math.round((done / graph.nodes.length) * 100) }
  }
  const done = progress.completedMissionIds.length
  return { done, total: done, percent: 0 }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      completeOnboarding: (journeyId) => {
        if (!isJourneyReleased(journeyId)) return
        setState((current) => ({
          ...current,
          onboardingComplete: true,
          activeJourneyId: journeyId,
          goals: [journeyId],
          journeyProgress: {
            ...current.journeyProgress,
            [journeyId]: current.journeyProgress[journeyId] ?? emptyJourneyProgress(),
          },
        }))
      },
      setActiveJourney: (journeyId) => {
        if (!isJourneyReleased(journeyId)) return
        setState((current) => ({
          ...current,
          activeJourneyId: journeyId,
          journeyProgress: {
            ...current.journeyProgress,
            [journeyId]: current.journeyProgress[journeyId] ?? emptyJourneyProgress(),
          },
        }))
      },
      setLanguage: (language) => {
        setState((current) => ({ ...current, language }))
      },
      setShowTransliteration: (value) => {
        setState((current) => ({ ...current, showTransliteration: value }))
      },
      setShowTranslation: (value) => {
        setState((current) => ({ ...current, showTranslation: value }))
      },
      discoverWord: (id) => {
        setState((current) =>
          patchActiveProgress(current, (progress) => {
            if (progress.discoveredVocab.includes(id)) return progress
            return {
              ...progress,
              discoveredVocab: [...progress.discoveredVocab, id],
              wordConfidence: {
                ...progress.wordConfidence,
                [id]: progress.wordConfidence[id] ?? "seen",
              },
            }
          }),
        )
      },
      setConfidence: (id, confidence) => {
        setState((current) =>
          patchActiveProgress(current, (progress) => ({
            ...progress,
            wordConfidence: { ...progress.wordConfidence, [id]: confidence },
          })),
        )
      },
      toggleBookmark: (lessonId, wordId) => {
        setState((current) =>
          patchActiveProgress(current, (progress) => ({
            ...progress,
            bookmarkedVocab: toggleBookmarkInList(progress.bookmarkedVocab, lessonId, wordId),
          })),
        )
      },
      setBookmarkedVocab: (items) => {
        setState((current) =>
          patchActiveProgress(current, (progress) => ({
            ...progress,
            bookmarkedVocab: items,
          })),
        )
      },
      setLessonCompleted: (id, completed) => {
        setState((current) =>
          patchActiveProgress(current, (progress) => ({
            ...progress,
            completedLessonIds: completed
              ? progress.completedLessonIds.includes(id)
                ? progress.completedLessonIds
                : [...progress.completedLessonIds, id]
              : progress.completedLessonIds.filter((item) => item !== id),
          })),
        )
      },
      practiceSupplication: (id) => {
        setState((current) => {
          if (current.practicedSupplications.includes(id)) return current
          return {
            ...current,
            practicedSupplications: [...current.practicedSupplications, id],
          }
        })
      },
      completeMission: ({ id, kind, vocabularyIds, rewards, capabilityId, capabilityLevel, outcome }) => {
        setState((current) =>
          patchActiveProgress(current, (progress) => {
            const discoveredVocab = [...progress.discoveredVocab]
            const wordConfidence = { ...progress.wordConfidence }
            for (const vocabId of vocabularyIds) {
              if (!discoveredVocab.includes(vocabId)) discoveredVocab.push(vocabId)
              wordConfidence[vocabId] = wordConfidence[vocabId] ?? "seen"
            }
            const capabilities = { ...progress.capabilities }
            if (rewards) {
              for (const [key, level] of Object.entries(rewards)) {
                const next = Math.max(capabilities[key] ?? 0, level ?? 0) as 0 | 1 | 2 | 3
                capabilities[key] = next
              }
            }
            if (capabilityId && capabilityLevel) {
              capabilities[capabilityId] = Math.max(
                capabilities[capabilityId] ?? 0,
                capabilityLevel,
              ) as 0 | 1 | 2 | 3
            }
            return {
              ...progress,
              discoveredVocab,
              wordConfidence,
              capabilities,
              missionOutcomes: { ...progress.missionOutcomes, [id]: outcome },
              missionPlayCounts: {
                ...progress.missionPlayCounts,
                [id]: (progress.missionPlayCounts[id] ?? 0) + 1,
              },
              completedMissionIds:
                kind === "mission" && !progress.completedMissionIds.includes(id)
                  ? [...progress.completedMissionIds, id]
                  : progress.completedMissionIds,
              completedLessonIds:
                kind === "lesson" && !progress.completedLessonIds.includes(id)
                  ? [...progress.completedLessonIds, id]
                  : progress.completedLessonIds,
            }
          }),
        )
      },
      deleteAllData: () => {
        setState({ ...defaultAppState })
      },
      dismissMapIntro: () => {
        setState((current) =>
          current.mapIntroDismissed ? current : { ...current, mapIntroDismissed: true },
        )
      },
      setMockSignedIn: (value) => {
        setState((current) =>
          current.mockSignedIn === value ? current : { ...current, mockSignedIn: value },
        )
      },
    }),
    [state],
  )

  return createElement(AppStateContext.Provider, { value }, children)
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider")
  }
  return context
}

export function useActiveJourney() {
  const { state, setActiveJourney } = useAppState()
  const journey = getJourney(state.activeJourneyId) ?? journeys[0]
  const progress = getJourneyProgress(state)
  const stats = missionStats(state.activeJourneyId, progress)
  return { journey, progress, stats, setActiveJourney }
}
