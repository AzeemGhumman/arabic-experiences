/** Resolve a `?from=` query value to the path Back should return to. */
export function returnPathFromFromParam(from: string | null | undefined): string | undefined {
  if (!from) return undefined
  if (from === "study") return "/study"
  if (from === "bookmarks") return "/study/bookmarks"
  return `/missions/${from}`
}
