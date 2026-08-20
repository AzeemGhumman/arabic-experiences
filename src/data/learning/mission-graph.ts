import { getMission } from "@/data/learning/missions"
import { getLesson } from "@/data/learning/lessons"

export type MissionKind = "mission" | "side"
export type PathCol = 0 | 1 | 2

export type Chapter = {
  id: string
  label: string
  /** First row of this part of the journey. */
  row: number
}

export type MissionNode = {
  id: string
  label: string
  kind: MissionKind
  /** Chapter from the top of the path. */
  row: number
  /** At most three places side by side. */
  col: PathCol
  /** Empty means an entry point. */
  requires: string[]
  /** If true, any listed parent unlocks this node. Otherwise all are required. */
  requireAny?: boolean
}

export type MissionEdge = {
  from: string
  to: string
  kind: MissionKind
}

export type MissionGraph = {
  nodes: MissionNode[]
  edges: MissionEdge[]
  chapters?: Chapter[]
}

export const PATH_COLS = 3
export const PATH_WIDTH = 360
export const PATH_ROW_HEIGHT = 118
export const SIDE_RAIL = 44

export type PathPoint = { x: number; y: number }

/**
 * Spine stays in a narrow centered band so gutters stay empty for sides.
 * Side stamps alternate left/right, each below the last.
 */
const NODE_POS: Record<string, PathPoint> = {
  immigration: { x: 180, y: 64 },
  "airport-arrival": { x: 214, y: 152 },
  "taxi-hotel": { x: 180, y: 240 },
  "find-haram": { x: 214, y: 72 },
  "enter-haram": { x: 154, y: 156 },
  "begin-tawaf": { x: 146, y: 268 },
  "find-zamzam": { x: 214, y: 352 },
  "complete-sai": { x: 198, y: 456 },
  barber: { x: 150, y: 548 },
  "day-madinah": { x: 180, y: 80 },
}

const SIDE_STACK = 72
/** Min center-to-center gap between consecutive spine stops (stamp + label). */
const MIN_SPINE_GAP = 96

function enforceSpineSpacing(layout: Map<string, PathPoint>, chains: MissionNode[][]) {
  for (const chain of chains) {
    for (let i = 1; i < chain.length; i++) {
      const prev = layout.get(chain[i - 1].id)
      const curr = layout.get(chain[i].id)
      if (!prev || !curr) continue
      const dx = curr.x - prev.x
      const dy = curr.y - prev.y
      const dist = Math.hypot(dx, dy)
      if (dist >= MIN_SPINE_GAP) continue
      const scale = MIN_SPINE_GAP / Math.max(dist, 1)
      layout.set(chain[i].id, { x: prev.x + dx * scale, y: prev.y + dy * scale })
    }
  }
}

export function buildAllSpineChains(nodes: MissionNode[], edges: MissionEdge[]): MissionNode[][] {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const spineEdges = edges.filter((edge) => edge.kind !== "side")
  const outgoing = new Map<string, string[]>()
  const incoming = new Set<string>()
  for (const edge of spineEdges) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) continue
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge.to])
    incoming.add(edge.to)
  }

  const starts = nodes
    .filter((node) => node.kind === "mission" && !incoming.has(node.id) && outgoing.has(node.id))
    .sort((a, b) => a.row - b.row || a.col - b.col)

  const chains: MissionNode[][] = []
  const seen = new Set<string>()
  for (const start of starts) {
    if (seen.has(start.id)) continue
    const chain: MissionNode[] = [start]
    seen.add(start.id)
    let current = start
    while (true) {
      const nextId = (outgoing.get(current.id) ?? []).find((id) => !seen.has(id))
      if (!nextId) break
      const next = byId.get(nextId)
      if (!next) break
      chain.push(next)
      seen.add(next.id)
      current = next
    }
    if (chain.length >= 1) chains.push(chain)
  }
  return chains
}

export function buildModuleLayout(
  nodes: MissionNode[],
  edges: MissionEdge[],
  stage: Chapter,
  width = PATH_WIDTH,
): Map<string, PathPoint> {
  const layout = new Map<string, PathPoint>()
  const spine = nodes.filter((node) => node.kind !== "side")
  const sides = nodes.filter((node) => node.kind === "side")

  for (const node of spine) {
    const placed = NODE_POS[node.id]
    layout.set(
      node.id,
      placed ?? {
        x: ((node.col + 0.5) / PATH_COLS) * width,
        y: (node.row - stage.row + 0.5) * PATH_ROW_HEIGHT,
      },
    )
  }

  enforceSpineSpacing(layout, buildAllSpineChains(nodes, edges))

  const ordered = [...sides].sort((a, b) => {
    const ay = layout.get(a.requires[0] ?? "")?.y ?? a.row
    const by = layout.get(b.requires[0] ?? "")?.y ?? b.row
    if (ay !== by) return ay - by
    if (a.row !== b.row) return a.row - b.row
    return a.col - b.col
  })

  let lastY = Number.NEGATIVE_INFINITY
  ordered.forEach((node, index) => {
    const parent = layout.get(node.requires[0] ?? "")
    const y = Math.max(parent?.y ?? PATH_ROW_HEIGHT / 2, lastY + SIDE_STACK)
    const x = index % 2 === 0 ? SIDE_RAIL : width - SIDE_RAIL
    layout.set(node.id, { x, y })
    lastY = y
  })

  for (const node of nodes) {
    if (!layout.has(node.id)) {
      layout.set(node.id, {
        x: ((node.col + 0.5) / PATH_COLS) * width,
        y: (node.row - stage.row + 0.5) * PATH_ROW_HEIGHT,
      })
    }
  }
  return layout
}

export function localCenter(node: MissionNode, layout: Map<string, PathPoint>, stage: Chapter) {
  return (
    layout.get(node.id) ?? {
      x: ((node.col + 0.5) / PATH_COLS) * PATH_WIDTH,
      y: (node.row - stage.row + 0.5) * PATH_ROW_HEIGHT,
    }
  )
}

export function moduleHeight(nodes: MissionNode[], edges: MissionEdge[], stage: Chapter) {
  const layout = buildModuleLayout(nodes, edges, stage)
  let maxY = PATH_ROW_HEIGHT
  for (const point of layout.values()) maxY = Math.max(maxY, point.y)
  return maxY + 70
}

export function graphChapters(graph: MissionGraph): Chapter[] {
  if (graph.chapters?.length) return [...graph.chapters].sort((a, b) => a.row - b.row)
  return [{ id: "path", label: "Path", row: 0 }]
}

export function chapterForNode(graph: MissionGraph, node: MissionNode) {
  const chapters = graphChapters(graph)
  let current = chapters[0]
  for (const stage of chapters) {
    if (stage.row <= node.row) current = stage
  }
  return current
}

export function nodesInChapter(graph: MissionGraph, stage: Chapter, next?: Chapter) {
  const end = next?.row ?? Number.POSITIVE_INFINITY
  return graph.nodes.filter((node) => node.row >= stage.row && node.row < end)
}

export function edgesInChapter(graph: MissionGraph, stage: Chapter, next?: Chapter) {
  const ids = new Set(nodesInChapter(graph, stage, next).map((node) => node.id))
  return graph.edges.filter((edge) => ids.has(edge.from) && ids.has(edge.to))
}

export type ModuleStatus = "here" | "done" | "ahead"

export const moduleStatusLabel: Record<ModuleStatus, string> = {
  here: "You're here",
  done: "Done",
  ahead: "Ahead",
}

export function isModuleReached(nodes: MissionNode[], completedIds: string[]) {
  return nodes.some((node) => isNodeUnlocked(node, completedIds))
}

export function isModuleDone(nodes: MissionNode[], completedIds: string[]) {
  const spine = nodes.filter((node) => node.kind === "mission")
  const targets = spine.length ? spine : nodes
  return targets.length > 0 && targets.every((node) => completedIds.includes(node.id))
}

export function currentModuleId(
  modules: { stage: Chapter; nodes: MissionNode[] }[],
  completedIds: string[],
) {
  const reached = modules.filter((item) => isModuleReached(item.nodes, completedIds))
  const active = reached.find((item) => !isModuleDone(item.nodes, completedIds))
  return (active ?? reached.at(-1) ?? modules[0])?.stage.id
}

export function statusForModule(
  nodes: MissionNode[],
  completedIds: string[],
  currentId: string | undefined,
  stageId: string,
): ModuleStatus {
  if (stageId === currentId) return "here"
  if (isModuleDone(nodes, completedIds)) return "done"
  return "ahead"
}

function spine(id: string, label: string, row: number, col: PathCol, requires: string[]): MissionNode {
  return { id, label, kind: "mission", row, col, requires }
}

function side(id: string, label: string, row: number, col: PathCol, requires: string[]): MissionNode {
  return { id, label, kind: "side", row, col, requires }
}

function walk(from: string, to: string, kind: MissionKind = "mission"): MissionEdge {
  return { from, to, kind }
}

/** Umrah as a trip: arrival, Makkah rites, then Madinah. Side nodes do not block the spine. */
export const umrahGraph: MissionGraph = {
  chapters: [
    { id: "arrival", label: "Arrival", row: 0 },
    { id: "makkah", label: "Makkah", row: 3 },
    { id: "madinah", label: "Madinah", row: 9 },
  ],
  nodes: [
    spine("immigration", "Passport", 0, 1, []),
    spine("airport-arrival", "Airport", 1, 1, ["immigration"]),
    spine("taxi-hotel", "Taxi", 2, 1, ["airport-arrival"]),
    spine("find-haram", "Gate", 3, 1, ["taxi-hotel"]),
    side("order-dinner", "Dinner", 3, 0, ["find-haram"]),
    spine("enter-haram", "Enter", 4, 1, ["find-haram"]),
    side("lost-group", "Lost?", 4, 0, ["enter-haram"]),
    side("something-wrong", "Help", 4, 2, ["enter-haram"]),
    spine("begin-tawaf", "Tawaf", 5, 1, ["enter-haram"]),
    spine("find-zamzam", "Zamzam", 6, 1, ["begin-tawaf"]),
    spine("complete-sai", "Sa'i", 7, 1, ["find-zamzam"]),
    spine("barber", "Barber", 8, 1, ["complete-sai"]),
    spine("day-madinah", "Madinah", 9, 1, ["barber"]),
  ],
  edges: [
    walk("immigration", "airport-arrival"),
    walk("airport-arrival", "taxi-hotel"),
    walk("taxi-hotel", "find-haram"),
    walk("find-haram", "enter-haram"),
    walk("find-haram", "order-dinner", "side"),
    walk("enter-haram", "begin-tawaf"),
    walk("enter-haram", "lost-group", "side"),
    walk("enter-haram", "something-wrong", "side"),
    walk("begin-tawaf", "find-zamzam"),
    walk("find-zamzam", "complete-sai"),
    walk("complete-sai", "barber"),
    walk("barber", "day-madinah"),
  ],
}

export function isNodeUnlocked(node: MissionNode, completedIds: string[]) {
  if (completedIds.includes(node.id)) return true
  if (node.requires.length === 0) return true
  return node.requireAny
    ? node.requires.some((id) => completedIds.includes(id))
    : node.requires.every((id) => completedIds.includes(id))
}

/** Map missions available in the current preview. Expand as content ships. */
const PREVIEW_RELEASED_MISSION_IDS = new Set(["immigration"])

/** Study lessons available in the current preview. */
const PREVIEW_RELEASED_LESSON_IDS = new Set([
  "numbers-everywhere",
  "numbers-to-100",
  "polite-basic",
  "packing-basic",
  "master-navigation",
  "navigation-gps",
  "transport-basic",
  "airport-basic",
  "geography-basic",
  "hotel-basic",
  "room-service-basic",
  "money-basic",
  "explore-food",
  "food-menu",
  "shopping-basic",
  "colors-basic",
  "colors-extended",
  "clothes-basic",
  "time-basic",
  "family-basic",
  "family-more",
  "haram-basic",
  "haram-more",
  "ritual-basic",
  "nabawi-basic",
  "barber-basic",
  "health-basic",
  "body-basic",
  "actions-basic",
  "adjectives-basic",
  "nature-basic",
])

export function isMissionReleased(id: string) {
  return PREVIEW_RELEASED_MISSION_IDS.has(id)
}

export function isLessonReleased(id: string) {
  return PREVIEW_RELEASED_LESSON_IDS.has(id)
}

export function isMissionPlayable(id: string) {
  if (!isMissionReleased(id)) return false
  return Boolean(getMission(id)?.playable)
}

export function isLessonPlayable(id: string) {
  if (!isLessonReleased(id)) return false
  return Boolean(getLesson(id)?.playable)
}

export function missionHref(id: string) {
  if (!isMissionPlayable(id)) return undefined
  return `/play/${id}`
}

export function lessonHref(id: string) {
  if (!isLessonPlayable(id)) return undefined
  return `/lessons/${id}`
}

export function availableMissions(graph: MissionGraph, completedIds: string[]) {
  return graph.nodes.filter(
    (node) => isNodeUnlocked(node, completedIds) && isMissionPlayable(node.id) && !completedIds.includes(node.id),
  )
}

export function openMissions(graph: MissionGraph, completedIds: string[]) {
  return [...availableMissions(graph, completedIds)].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row
    return a.col - b.col
  })
}

export function nextPlayableMission(completedIds: string[], graph: MissionGraph = umrahGraph) {
  return openMissions(graph, completedIds)[0]?.id
}

export function graphForJourney(id: string): MissionGraph | undefined {
  if (id === "umrah") return umrahGraph
  return undefined
}
