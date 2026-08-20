import { useState } from "react"
import { Link } from "react-router-dom"
import { Check, ChevronDown, Lock, Star } from "lucide-react"
import { missionAvailability } from "@/data/learning/availability"
import { SceneMark, sceneForExperience } from "@/components/mission/ExperienceScenes"
import {
  Button,
} from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  buildAllSpineChains,
  buildModuleLayout,
  currentModuleId,
  edgesInChapter,
  graphChapters,
  isNodeUnlocked,
  localCenter,
  moduleHeight,
  nodesInChapter,
  PATH_WIDTH,
  statusForModule,
  type MissionGraph,
  type MissionNode,
  type ModuleStatus,
  type Chapter,
} from "@/data/learning/mission-graph"
import { HomeAboutButton } from "@/components/home/HomeAboutButton"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function ActivityMap({
  graph,
  completedIds,
}: {
  graph: MissionGraph
  completedIds: string[]
  compact?: boolean
}) {
  const stages = graphChapters(graph)
  const modules = stages.map((stage, index) => {
    const next = stages[index + 1]
    const nodes = nodesInChapter(graph, stage, next)
    return { stage, next, nodes, edges: edgesInChapter(graph, stage, next) }
  })
  const hereId = currentModuleId(modules, completedIds)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const { t } = useI18n()

  function isOpen(stageId: string, here: boolean) {
    if (stageId in expanded) return expanded[stageId]
    return here
  }

  function toggle(stageId: string, here: boolean) {
    setExpanded((current) => ({ ...current, [stageId]: !isOpen(stageId, here) }))
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-border pb-4">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg">{t("map.yourJourney")}</h2>
          <HomeAboutButton />
        </div>
        <p className="mt-1 text-sm leading-snug text-muted-foreground">{t("map.lede")}</p>
      </div>
      <div className="space-y-2.5 bg-muted/35 px-3 pt-2">
        {modules.map((mod) => {
          const status = statusForModule(mod.nodes, completedIds, hereId, mod.stage.id)
          const here = status === "here"
          const open = isOpen(mod.stage.id, here)

          return (
            <PathModule
              key={mod.stage.id}
              stage={mod.stage}
              nodes={mod.nodes}
              edges={mod.edges}
              completedIds={completedIds}
              status={status}
              open={open}
              onToggle={() => toggle(mod.stage.id, here)}
            />
          )
        })}
      </div>
    </section>
  )
}

function PathModule({
  stage,
  nodes,
  edges,
  completedIds,
  status,
  open,
  onToggle,
}: {
  stage: Chapter
  nodes: MissionNode[]
  edges: MissionGraph["edges"]
  completedIds: string[]
  status: ModuleStatus
  open: boolean
  onToggle: () => void
}) {
  const layout = buildModuleLayout(nodes, edges, stage)
  const height = moduleHeight(nodes, edges, stage)
  const viewBox = `0 0 ${PATH_WIDTH} ${height}`
  const here = status === "here"
  const { t, chapter: chapterLabel, mission } = useI18n()
  const [blocked, setBlocked] = useState<{ kind: "soon" | "locked"; label: string } | null>(null)

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border bg-paper shadow-sm",
        here ? "border-terracotta/50" : "border-border",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="relative z-10 flex w-full cursor-pointer items-center gap-3 border-b border-border/60 bg-paper px-4 py-3 text-start"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            {status === "done" ? (
              <Check className="size-3.5 shrink-0 text-sage-deep" />
            ) : here ? (
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-50" />
                <span className="relative inline-flex size-2.5 rounded-full bg-terracotta" />
              </span>
            ) : (
              <span className="size-2.5 shrink-0 rounded-full bg-muted-foreground/25" />
            )}
            <span className={cn(
              "text-[11px] font-semibold tracking-[0.18em] uppercase",
              status === "ahead" ? "text-muted-foreground" : "text-terracotta",
            )}>{chapterLabel(stage.id, stage.label)}</span>
          </span>
        </span>
        <ChevronDown className={cn("size-5 shrink-0 text-ink-soft transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="journey-map relative" style={{ height }}>
          <svg
            viewBox={viewBox}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <SideLinks nodes={nodes} layout={layout} completedIds={completedIds} />
            <SpineTrail nodes={nodes} edges={edges} layout={layout} completedIds={completedIds} />
          </svg>

          {nodes.map((node) => {
            const completed = completedIds.includes(node.id)
            const availability = missionAvailability(node.id, completedIds, node)
            const canVisit = availability === "open" || availability === "done"
            const openPlace = availability === "open"
            const side = node.kind === "side"
            const point = localCenter(node, layout, stage)

            const label = mission(node.id, node.label)

            const stamp = (
              <>
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="relative inline-flex">
                    <SceneMark
                      scene={sceneForExperience(node.id)}
                      missionId={node.id}
                      className={cn(
                        "border-[3px] shadow-md",
                        side ? "size-11" : "size-14",
                        availability === "done" && "border-sage",
                        availability === "open" && "border-terracotta",
                        availability === "open" && openPlace && !side && "animate-map-pulse",
                        (availability === "locked" || availability === "coming-soon") &&
                          "border-border/70 grayscale",
                      )}
                    />
                    {availability === "done" ? (
                      <span className="absolute -end-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full border-2 border-paper bg-sage text-white">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    ) : null}
                    {availability === "locked" || availability === "coming-soon" ? (
                      <span className="absolute -end-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full border-2 border-paper bg-secondary text-muted-foreground">
                        <Lock className="size-2.5" strokeWidth={2.5} />
                      </span>
                    ) : null}
                    {side && availability !== "done" && availability !== "coming-soon" ? (
                      <span className="absolute -end-1 -top-1 flex size-[18px] items-center justify-center rounded-full border-2 border-paper bg-gold text-white">
                        <Star className="size-2.5" strokeWidth={0} fill="currentColor" />
                      </span>
                    ) : null}
                  </span>
                </span>
                <span
                  className={cn(
                    "map-label absolute left-1/2 w-full -translate-x-1/2 text-center font-semibold leading-tight",
                    side ? "top-[26px] text-[11px]" : "top-[30px] text-[11px]",
                    availability === "done" && "text-sage-deep",
                    availability === "open" && "text-terracotta",
                    (availability === "locked" || availability === "coming-soon") && "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </>
            )

            return (
              <div
                key={node.id}
                className="absolute"
                style={{ left: `${(point.x / PATH_WIDTH) * 100}%`, top: `${(point.y / height) * 100}%` }}
              >
                {canVisit ? (
                  <Link
                    to={`/missions/${node.id}`}
                    aria-label={completed ? `${label}, ${t("common.done")}` : label}
                    className={cn(
                      "relative block -translate-x-1/2 cursor-pointer",
                      side ? "w-[4.5rem]" : "w-[5.75rem]",
                    )}
                  >
                    {stamp}
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-label={`${label}, ${availability === "locked" ? t("common.locked") : t("mission.comingSoonTitle")}`}
                    onClick={() =>
                      setBlocked({
                        kind: availability === "locked" ? "locked" : "soon",
                        label,
                      })
                    }
                    className={cn(
                      "relative block -translate-x-1/2 cursor-pointer",
                      side ? "w-[4.5rem]" : "w-[5.75rem]",
                    )}
                  >
                    {stamp}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : null}

      <Dialog open={Boolean(blocked)} onOpenChange={(open) => !open && setBlocked(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {blocked?.kind === "locked" ? t("common.locked") : t("mission.comingSoonTitle")}
            </DialogTitle>
            <DialogDescription>
              {blocked?.kind === "locked" ? t("mission.lockedBody") : t("mission.comingSoonBody")}
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button className="mt-4 w-full" variant="terracotta">
              {t("mission.comingSoonDismiss")}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </article>
  )
}

function stampAnchor(node: MissionNode, layout: Map<string, { x: number; y: number }>) {
  return layout.get(node.id) ?? { x: 0, y: 0 }
}

/**
 * Hairline tethers from each spine stop to its side missions. Drawn before the
 * spine so it stays dominant, and centre-to-centre — the opaque stamps cover
 * the ends, so no trimming math is needed against the two stamp radii.
 */
function SideLinks({
  nodes,
  layout,
  completedIds,
}: {
  nodes: MissionNode[]
  layout: Map<string, { x: number; y: number }>
  completedIds: string[]
}) {
  const links = nodes.flatMap((node) => {
    if (node.kind !== "side") return []
    const parentId = node.requires.find((id) => layout.has(id))
    if (!parentId) return []
    const from = layout.get(parentId)
    const to = layout.get(node.id)
    if (!from || !to) return []
    return [{ id: node.id, from, to, lit: completedIds.includes(node.id) || isNodeUnlocked(node, completedIds) }]
  })
  if (!links.length) return null

  return (
    <>
      {links.map((link) => {
        const c = quadToCubic(link.from, link.to)
        const d = pathFromCubics([c])
        return (
          <path
            key={link.id}
            d={d}
            fill="none"
            stroke="#d8d0c4"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="4 8"
            opacity={0.55}
          />
        )
      })}
    </>
  )
}

function SpineTrail({
  nodes,
  edges,
  layout,
  completedIds,
}: {
  nodes: MissionNode[]
  edges: MissionGraph["edges"]
  layout: Map<string, { x: number; y: number }>
  completedIds: string[]
}) {
  const chains = buildAllSpineChains(nodes, edges).filter((chain) => chain.length >= 2)
  if (!chains.length) return null

  const walkedSets = chains.map((chain) => {
    const walkedUntil = chain.findIndex((node, i) => {
      if (i === 0) return false
      const prev = chain[i - 1]
      return !(completedIds.includes(prev.id) && (completedIds.includes(node.id) || isNodeUnlocked(node, completedIds)))
    })
    return new Set(walkedUntil === -1 ? chain.map((n) => n.id) : chain.slice(0, walkedUntil).map((n) => n.id))
  })

  const allSteps = chains.flatMap((chain, ci) => {
    const pts = chain.map((node) => stampAnchor(node, layout))
    const cubics = mapTrailCubics(pts)
    return cubics.flatMap((c, si) =>
      sampleCubic(c, STEP_SPACING).map((s) => ({
        ...s,
        walked: walkedSets[ci].has(chain[si].id) && walkedSets[ci].has(chain[si + 1].id),
      })),
    )
  })

  return (
    <>
      {allSteps.map((step, i) => (
        <Footstep key={i} x={step.x} y={step.y} angle={step.angle} index={i} walked={step.walked} />
      ))}
    </>
  )
}

type Point = { x: number; y: number }
type Cubic = { p0: Point; p1: Point; p2: Point; p3: Point }

const STEP_SPACING = 18

/** A single foot — alternates left/right, offset to the side of the path like natural walking. */
function Footstep({ x, y, angle, index, walked }: { x: number; y: number; angle: number; index: number; walked: boolean }) {
  const left = index % 2 === 0
  const sideShift = left ? -4 : 4
  const fill = walked ? "#c4785a" : "#c4b99a"
  const opacity = walked ? 0.72 : 0.38
  const sx = left ? 1 : -1
  return (
    <g transform={`translate(${x},${y}) rotate(${angle}) translate(${sideShift},0) scale(${sx},1)`} opacity={opacity}>
      <ellipse cx="0" cy="1" rx="2.6" ry="2.2" fill={fill} />
      <ellipse cx="-0.3" cy="4" rx="1.6" ry="2" fill={fill} />
      <circle cx="-1.4" cy="-1.5" r="0.95" fill={fill} />
      <circle cx="0" cy="-2" r="1" fill={fill} />
      <circle cx="1.3" cy="-1.7" r="0.85" fill={fill} />
      <circle cx="2.3" cy="-1" r="0.7" fill={fill} />
      <circle cx="-2.4" cy="-0.7" r="0.65" fill={fill} />
    </g>
  )
}

/** Walk along a cubic Bézier and yield evenly-spaced {x, y, angle} samples. */
function sampleCubic(c: Cubic, spacing: number) {
  const steps: { x: number; y: number; angle: number }[] = []
  const n = 80
  let carry = spacing * 0.5
  for (let i = 0; i < n; i++) {
    const t0 = i / n
    const t1 = (i + 1) / n
    const a = evalCubic(c, t0)
    const b = evalCubic(c, t1)
    const dx = b.x - a.x
    const dy = b.y - a.y
    const seg = Math.hypot(dx, dy)
    carry += seg
    if (carry >= spacing) {
      carry -= spacing
      const tm = (t0 + t1) / 2
      const p = evalCubic(c, tm)
      const d = evalCubicDeriv(c, tm)
      steps.push({ x: p.x, y: p.y, angle: (Math.atan2(d.y, d.x) * 180) / Math.PI + 90 })
    }
  }
  return steps
}

function evalCubic(c: Cubic, t: number): Point {
  const u = 1 - t
  return {
    x: u * u * u * c.p0.x + 3 * u * u * t * c.p1.x + 3 * u * t * t * c.p2.x + t * t * t * c.p3.x,
    y: u * u * u * c.p0.y + 3 * u * u * t * c.p1.y + 3 * u * t * t * c.p2.y + t * t * t * c.p3.y,
  }
}

function evalCubicDeriv(c: Cubic, t: number): Point {
  const u = 1 - t
  return {
    x: 3 * u * u * (c.p1.x - c.p0.x) + 6 * u * t * (c.p2.x - c.p1.x) + 3 * t * t * (c.p3.x - c.p2.x),
    y: 3 * u * u * (c.p1.y - c.p0.y) + 6 * u * t * (c.p2.y - c.p1.y) + 3 * t * t * (c.p3.y - c.p2.y),
  }
}

/** Convert a quadratic arc into a cubic for uniform sampling. */
function quadToCubic(from: Point, to: Point): Cubic {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.hypot(dx, dy) || 1
  const bow = dist * 0.16
  const side = dx < 0 ? 1 : -1
  const qx = (from.x + to.x) / 2 + (-dy / dist) * bow * side
  const qy = (from.y + to.y) / 2 + (dx / dist) * bow * side
  return {
    p0: from,
    p1: { x: from.x + (2 / 3) * (qx - from.x), y: from.y + (2 / 3) * (qy - from.y) },
    p2: { x: to.x + (2 / 3) * (qx - to.x), y: to.y + (2 / 3) * (qy - to.y) },
    p3: to,
  }
}

function mapTrailCubics(points: Point[]): Cubic[] {
  const t = 0.22
  const cubics: Cubic[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? points[i + 1]
    cubics.push({
      p0: p1,
      p1: { x: p1.x + (p2.x - p0.x) * t, y: p1.y + (p2.y - p0.y) * t },
      p2: { x: p2.x - (p3.x - p1.x) * t, y: p2.y - (p3.y - p1.y) * t },
      p3: p2,
    })
  }
  return cubics
}

function pathFromCubics(cubics: Cubic[]) {
  if (!cubics.length) return ""
  const first = cubics[0]
  let d = `M ${first.p0.x} ${first.p0.y}`
  for (const cubic of cubics) {
    d += ` C ${cubic.p1.x} ${cubic.p1.y}, ${cubic.p2.x} ${cubic.p2.y}, ${cubic.p3.x} ${cubic.p3.y}`
  }
  return d
}
