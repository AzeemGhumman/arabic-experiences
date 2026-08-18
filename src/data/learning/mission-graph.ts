import { getAdventure } from "@/data/learning/adventures"
import { getSideMission } from "@/data/learning/side-missions"

export type MissionKind = "core" | "side"
export type PathCol = 0 | 1 | 2

export type PathStage = {
  id: string
  label: string
  /** First row of this part of the journey. */
  row: number
}

export type MissionNode = {
  id: string
  label: string
  kind: MissionKind
  /** Stage from the top of the path. */
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
  stages?: PathStage[]
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
  "taxi-hotel": { x: 180, y: 64 },
  "airport-arrival": { x: 214, y: 152 },
  immigration: { x: 146, y: 268 },
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
  const coreEdges = edges.filter((edge) => edge.kind !== "side")
  const outgoing = new Map<string, string[]>()
  const incoming = new Set<string>()
  for (const edge of coreEdges) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) continue
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge.to])
    incoming.add(edge.to)
  }

  const starts = nodes
    .filter((node) => node.kind === "core" && !incoming.has(node.id) && outgoing.has(node.id))
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
  stage: PathStage,
  width = PATH_WIDTH,
): Map<string, PathPoint> {
  const layout = new Map<string, PathPoint>()
  const core = nodes.filter((node) => node.kind !== "side")
  const sides = nodes.filter((node) => node.kind === "side")

  for (const node of core) {
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

export function localCenter(node: MissionNode, layout: Map<string, PathPoint>, stage: PathStage) {
  return (
    layout.get(node.id) ?? {
      x: ((node.col + 0.5) / PATH_COLS) * PATH_WIDTH,
      y: (node.row - stage.row + 0.5) * PATH_ROW_HEIGHT,
    }
  )
}

export function moduleHeight(nodes: MissionNode[], edges: MissionEdge[], stage: PathStage) {
  const layout = buildModuleLayout(nodes, edges, stage)
  let maxY = PATH_ROW_HEIGHT
  for (const point of layout.values()) maxY = Math.max(maxY, point.y)
  return maxY + 70
}

export function graphStages(graph: MissionGraph): PathStage[] {
  if (graph.stages?.length) return [...graph.stages].sort((a, b) => a.row - b.row)
  return [{ id: "path", label: "Path", row: 0 }]
}

export function stageForNode(graph: MissionGraph, node: MissionNode) {
  const stages = graphStages(graph)
  let current = stages[0]
  for (const stage of stages) {
    if (stage.row <= node.row) current = stage
  }
  return current
}

export function nodesInStage(graph: MissionGraph, stage: PathStage, next?: PathStage) {
  const end = next?.row ?? Number.POSITIVE_INFINITY
  return graph.nodes.filter((node) => node.row >= stage.row && node.row < end)
}

export function edgesInStage(graph: MissionGraph, stage: PathStage, next?: PathStage) {
  const ids = new Set(nodesInStage(graph, stage, next).map((node) => node.id))
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
  const core = nodes.filter((node) => node.kind === "core")
  const targets = core.length ? core : nodes
  return targets.length > 0 && targets.every((node) => completedIds.includes(node.id))
}

export function currentModuleId(
  modules: { stage: PathStage; nodes: MissionNode[] }[],
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

function core(id: string, label: string, row: number, col: PathCol, requires: string[]): MissionNode {
  return { id, label, kind: "core", row, col, requires }
}

function side(id: string, label: string, row: number, col: PathCol, requires: string[]): MissionNode {
  return { id, label, kind: "side", row, col, requires }
}

function walk(from: string, to: string, kind: MissionKind = "core"): MissionEdge {
  return { from, to, kind }
}

/** Umrah as a trip: arrival, Makkah rites, then Madinah. Side nodes do not block the spine. */
export const umrahGraph: MissionGraph = {
  stages: [
    { id: "arrival", label: "Arrival", row: 0 },
    { id: "makkah", label: "Makkah", row: 3 },
    { id: "madinah", label: "Madinah", row: 9 },
  ],
  nodes: [
    core("taxi-hotel", "Taxi", 0, 1, []),
    core("airport-arrival", "Airport", 1, 1, ["taxi-hotel"]),
    core("immigration", "Passport", 2, 1, ["airport-arrival"]),
    core("find-haram", "Gate", 3, 1, ["immigration"]),
    side("order-dinner", "Dinner", 3, 0, ["find-haram"]),
    core("enter-haram", "Enter", 4, 1, ["find-haram"]),
    side("lost-group", "Lost?", 4, 0, ["enter-haram"]),
    side("something-wrong", "Help", 4, 2, ["enter-haram"]),
    core("begin-tawaf", "Tawaf", 5, 1, ["enter-haram"]),
    core("find-zamzam", "Zamzam", 6, 1, ["begin-tawaf"]),
    core("complete-sai", "Sa'i", 7, 1, ["find-zamzam"]),
    core("barber", "Barber", 8, 1, ["complete-sai"]),
    core("day-madinah", "Madinah", 9, 1, ["barber"]),
  ],
  edges: [
    walk("taxi-hotel", "airport-arrival"),
    walk("airport-arrival", "immigration"),
    walk("immigration", "find-haram"),
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

export const arabicGraph: MissionGraph = {
  nodes: [
    { id: "taxi-hotel", label: "Taxi", kind: "core", row: 0, col: 0, requires: [] },
    { id: "find-haram", label: "Gate", kind: "core", row: 0, col: 2, requires: [] },
    { id: "order-dinner", label: "Dinner", kind: "core", row: 1, col: 0, requires: ["taxi-hotel"] },
    { id: "enter-haram", label: "Enter", kind: "core", row: 1, col: 2, requires: ["find-haram"] },
  ],
  edges: [
    { from: "taxi-hotel", to: "order-dinner", kind: "core" },
    { from: "find-haram", to: "enter-haram", kind: "core" },
  ],
}

export function isNodeUnlocked(node: MissionNode, completedIds: string[]) {
  if (completedIds.includes(node.id)) return true
  if (node.requires.length === 0) return true
  return node.requireAny
    ? node.requires.some((id) => completedIds.includes(id))
    : node.requires.every((id) => completedIds.includes(id))
}

/** Missions available in the current preview release. Expand as content ships. */
const PREVIEW_RELEASED_MISSION_IDS = new Set([
  "taxi-hotel",
  "master-navigation",
  "numbers-everywhere",
])

export function isMissionReleased(id: string) {
  return PREVIEW_RELEASED_MISSION_IDS.has(id)
}

export function isMissionPlayable(id: string) {
  if (!isMissionReleased(id)) return false
  return Boolean(getAdventure(id)?.playable || getSideMission(id)?.playable)
}

export function missionHref(id: string) {
  if (!isMissionReleased(id)) return undefined
  if (getSideMission(id)) return `/side-missions/${id}`
  if (getAdventure(id)?.playable) return `/adventures/${id}`
  return undefined
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

export function nextPlayableAdventure(completedIds: string[], graph: MissionGraph = umrahGraph) {
  return openMissions(graph, completedIds)[0]?.id
}

export function graphForJourney(id: string): MissionGraph | undefined {
  if (id === "umrah") return umrahGraph
  if (id === "arabic") return arabicGraph
  return undefined
}
