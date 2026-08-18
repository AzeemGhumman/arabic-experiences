export const rtlLanguages = new Set(["ur"])

export function isRtlLanguage(language: string) {
  return rtlLanguages.has(language)
}
