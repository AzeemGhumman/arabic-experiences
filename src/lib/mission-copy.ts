import type { LanguagePack, MissionStepCopy } from "@/locales/types"

type StepCopyFallback = {
  title?: string
  body?: string
  prompt?: string
  promptEnglish?: string
  question?: string
  feedback?: string
  situation?: string
}

/** Resolve localized mission step copy; falls back to builder English strings. */
export function resolveMissionStepCopy(
  pack: LanguagePack,
  missionId: string,
  copyKey: string | undefined,
  fallback: StepCopyFallback,
): Required<Pick<MissionStepCopy, never>> & {
  title?: string
  body?: string
  prompt?: string
  promptEnglish?: string
  question?: string
  feedback?: string
  situation?: string
} {
  const localized = copyKey ? pack.missionRuns[missionId]?.steps?.[copyKey] : undefined
  return {
    title: localized?.title ?? fallback.title,
    body: localized?.body ?? fallback.body,
    prompt: localized?.prompt ?? fallback.prompt,
    promptEnglish: localized?.audioMeaning ?? fallback.promptEnglish,
    question: localized?.question ?? fallback.question,
    feedback: localized?.feedback ?? fallback.feedback,
    situation: localized?.situation ?? fallback.situation,
  }
}

export function resolveMissionOutcome(pack: LanguagePack, missionId: string, fallback: string) {
  return pack.missionRuns[missionId]?.outcome ?? fallback
}
