export type LexiconPhrase = {
  arabic: string
  transliteration: string
  meaning: string
  category: string | null
}

export type LexiconEntry = {
  id: string
  arabic: string
  arabicBare: string
  meaning: string
  transliteration: string | null
  ipa: string | null
  sceneIds: string[]
  swadeshNo: number | null
  quranFrequency: number | null
  quranPos: string | null
  quranLemma: string | null
  msaRank: number | null
  msaGloss: string | null
  phrases: LexiconPhrase[]
  sources: string[]
}

export type LexiconFile = {
  id: string
  title: string
  generatedAt: string
  description: string
  sources: string[]
  wordCount: number
  entries: LexiconEntry[]
}
