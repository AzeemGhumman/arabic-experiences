import { en } from "@/locales/en"
import { ur } from "@/locales/ur"
import type { LanguagePack, SupportedLanguage } from "@/locales/types"

/** All registered language packs. Add a new locale file and entry here. */
export const languagePacks: Record<SupportedLanguage, LanguagePack> = {
  en,
  ur,
}

export const supportedLanguages = Object.keys(languagePacks) as SupportedLanguage[]

export function getLanguagePack(code: string): LanguagePack {
  if (code in languagePacks) return languagePacks[code as SupportedLanguage]
  return languagePacks.en
}

export function languageOptions() {
  return supportedLanguages.map((code) => ({
    id: code,
    label: languagePacks[code].meta.name,
    native: languagePacks[code].meta.nativeName,
  }))
}

export type {
  MissionStrings,
  MissionStepCopy,
  MissionRunCopy,
  LessonStrings,
  LessonRunCopy,
  CapabilityStrings,
  JourneyStrings,
  LanguagePack,
  SupportedLanguage,
} from "@/locales/types"
