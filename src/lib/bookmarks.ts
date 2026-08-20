export type VocabBookmark = {
  wordId: string
  lessonId: string
}

export function bookmarkKey(lessonId: string, wordId: string) {
  return `${lessonId}::${wordId}`
}

export function parseBookmarkKey(key: string): VocabBookmark | null {
  const split = key.indexOf("::")
  if (split <= 0) return null
  const lessonId = key.slice(0, split)
  const wordId = key.slice(split + 2)
  if (!lessonId || !wordId) return null
  return { lessonId, wordId }
}

export function hasBookmark(list: VocabBookmark[], lessonId: string, wordId: string) {
  return list.some((item) => item.lessonId === lessonId && item.wordId === wordId)
}

export function toggleBookmarkInList(
  list: VocabBookmark[],
  lessonId: string,
  wordId: string,
): VocabBookmark[] {
  if (hasBookmark(list, lessonId, wordId)) {
    return list.filter((item) => !(item.lessonId === lessonId && item.wordId === wordId))
  }
  return [...list, { lessonId, wordId }]
}

export function normalizeBookmarks(raw: unknown): VocabBookmark[] {
  if (!Array.isArray(raw)) return []
  const next: VocabBookmark[] = []
  const seen = new Set<string>()

  for (const item of raw) {
    if (!item || typeof item !== "object" || !("wordId" in item) || !("lessonId" in item)) continue
    const wordId = String((item as VocabBookmark).wordId)
    const lessonId = String((item as VocabBookmark).lessonId)
    if (!wordId || !lessonId) continue
    const key = bookmarkKey(lessonId, wordId)
    if (seen.has(key)) continue
    seen.add(key)
    next.push({ wordId, lessonId })
  }

  return next
}
