import type { LexiconEntry, LexiconFile } from "./types"
import raw from "./words.json"

const lexicon = raw as LexiconFile

const bySceneId = new Map<string, LexiconEntry>()
const byBare = new Map<string, LexiconEntry>()

for (const entry of lexicon.entries) {
  byBare.set(entry.arabicBare, entry)
  for (const sceneId of entry.sceneIds) {
    bySceneId.set(sceneId, entry)
  }
}

export function getLexiconBySceneId(id: string) {
  return bySceneId.get(id)
}

export function getLexiconByBare(arabicBare: string) {
  return byBare.get(arabicBare)
}

export const lexiconMeta = {
  generatedAt: lexicon.generatedAt,
  wordCount: lexicon.wordCount,
  sources: lexicon.sources,
}

/** Traditional approximate word count of the Quran; lemma frequencies are from the Quranic Arabic Corpus. */
export const QURAN_APPROX_WORD_COUNT = 77_430

export const QURAN_CORPUS_NOTE =
  "Lemma counts from the Quranic Arabic Corpus via Wiktionary. Prototype use only; not a scholarly recount."
