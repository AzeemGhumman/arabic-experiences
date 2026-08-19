export type VocabBookmark = {
  wordId: string
  sessionId: string
}

export function bookmarkKey(sessionId: string, wordId: string) {
  return `${sessionId}::${wordId}`
}

export function parseBookmarkKey(key: string): VocabBookmark | null {
  const split = key.indexOf("::")
  if (split <= 0) return null
  const sessionId = key.slice(0, split)
  const wordId = key.slice(split + 2)
  if (!sessionId || !wordId) return null
  return { sessionId, wordId }
}

export function hasBookmark(list: VocabBookmark[], sessionId: string, wordId: string) {
  return list.some((item) => item.sessionId === sessionId && item.wordId === wordId)
}

export function toggleBookmarkInList(
  list: VocabBookmark[],
  sessionId: string,
  wordId: string,
): VocabBookmark[] {
  if (hasBookmark(list, sessionId, wordId)) {
    return list.filter((item) => !(item.sessionId === sessionId && item.wordId === wordId))
  }
  return [...list, { sessionId, wordId }]
}

/** Accepts `{ wordId, sessionId }` and legacy word-id strings (dropped if unscoped). */
export function normalizeBookmarks(raw: unknown): VocabBookmark[] {
  if (!Array.isArray(raw)) return []
  const next: VocabBookmark[] = []
  const seen = new Set<string>()

  for (const item of raw) {
    let entry: VocabBookmark | null = null
    if (typeof item === "string") {
      entry = parseBookmarkKey(item)
    } else if (item && typeof item === "object" && "wordId" in item && "sessionId" in item) {
      const wordId = String((item as VocabBookmark).wordId)
      const sessionId = String((item as VocabBookmark).sessionId)
      if (wordId && sessionId) entry = { wordId, sessionId }
    }
    if (!entry) continue
    const key = bookmarkKey(entry.sessionId, entry.wordId)
    if (seen.has(key)) continue
    seen.add(key)
    next.push(entry)
  }

  return next
}
