import { getLanguagePack } from "@/locales"

export function localeDir(language: string): "ltr" | "rtl" {
  return getLanguagePack(language).meta.dir
}

export function localeHtmlLang(language: string) {
  return getLanguagePack(language).meta.htmlLang
}

export function isRtlLanguage(language: string) {
  return localeDir(language) === "rtl"
}

/** Apply UI lang/dir and language-specific UI fonts on <html>. */
export function applyLocaleToDocument(language: string) {
  const pack = getLanguagePack(language)
  const root = document.documentElement
  root.lang = pack.meta.htmlLang
  root.dir = pack.meta.dir
  root.style.setProperty("--font-sans", pack.meta.fonts.sans)
  root.style.setProperty("--font-display", pack.meta.fonts.display)
}

export function resetLocaleDocument() {
  const pack = getLanguagePack("en")
  const root = document.documentElement
  root.lang = pack.meta.htmlLang
  root.dir = pack.meta.dir
  root.style.setProperty("--font-sans", pack.meta.fonts.sans)
  root.style.setProperty("--font-display", pack.meta.fonts.display)
}
