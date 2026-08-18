import { createContext, createElement, useContext, useMemo } from "react"
import type { ReactNode } from "react"
import { getLanguagePack } from "@/locales"
import type { AdventureStrings, LanguagePack, SupportedLanguage } from "@/locales"
import { useAppState } from "@/lib/app-state"
import type { JourneyCategory, UiLanguage } from "@/lib/storage"

type I18nContextValue = {
  language: UiLanguage
  pack: LanguagePack
  /** UI strings under `pack.ui`, e.g. t('nav.home') or t('profile.title', { done: 3 }) */
  t: (path: string, params?: Record<string, string | number>) => string
  journey: (id: JourneyCategory) => LanguagePack["journeys"][JourneyCategory]
  stage: (id: string, fallback?: string) => string
  mission: (id: string, fallback?: string) => string
  adventure: (id: string) => AdventureStrings | undefined
  capability: (id: string) => LanguagePack["capabilities"][string] | undefined
  depthLabel: (level: number) => string
  word: (id: string, fallback: string) => string
  moduleStatus: (status: "here" | "done" | "ahead") => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getNested(obj: unknown, path: string): string | undefined {
  const parts = path.split(".")
  let cur: unknown = obj
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined
    cur = (cur as Record<string, unknown>)[part]
  }
  return typeof cur === "string" ? cur : undefined
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`,
  )
}

function buildI18n(language: UiLanguage): I18nContextValue {
  const pack = getLanguagePack(language)
  const t = (path: string, params?: Record<string, string | number>) =>
    interpolate(getNested(pack.ui, path) ?? path, params)

  return {
    language,
    pack,
    t,
    journey: (id) => pack.journeys[id],
    stage: (id, fallback = id) => pack.stages[id] ?? fallback,
    mission: (id, fallback = id) => pack.missions[id] ?? fallback,
    adventure: (id) => pack.adventures[id],
    capability: (id) => pack.capabilities[id],
    depthLabel: (level) => {
      if (level >= 3) return pack.ui.depth.master
      if (level >= 2) return pack.ui.depth.explore
      if (level >= 1) return pack.ui.depth.core
      return pack.ui.depth.notStarted
    },
    word: (id, fallback) => pack.words[id] ?? fallback,
    moduleStatus: (status) => {
      if (status === "here") return pack.ui.common.here
      if (status === "done") return pack.ui.common.done
      return pack.ui.common.ahead
    },
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { state } = useAppState()
  const value = useMemo(() => buildI18n(state.language), [state.language])
  return createElement(I18nContext.Provider, { value }, children)
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}

/** For non-React code paths (data helpers). */
export function i18nFor(language: SupportedLanguage) {
  return buildI18n(language)
}
