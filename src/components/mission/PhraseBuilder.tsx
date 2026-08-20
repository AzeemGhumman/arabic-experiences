import { useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { Button } from "@/components/ui/button"
import { shuffleAvoidingOrder } from "@/components/mission/MissionBits"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type DragState = {
  token: string
  from: "pool" | "built"
  index: number
  pointerId: number
  originX: number
  originY: number
  moved: boolean
  activated: boolean
}

type CheckState = "idle" | "wrong" | "correct"

export function PhraseBuilder({
  prompt,
  tokens,
  correctOrder,
  onSolved,
}: {
  prompt?: string
  tokens: string[]
  correctOrder: string[]
  onSolved: () => void
}) {
  const { t } = useI18n()
  const [built, setBuilt] = useState<string[]>([])
  const [check, setCheck] = useState<CheckState>("idle")
  const [pool] = useState(() => shuffleAvoidingOrder(tokens, correctOrder))
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overTray, setOverTray] = useState(false)
  const trayRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const insertRef = useRef<number | null>(null)
  const overRef = useRef(false)
  const frameRef = useRef<number>(0)

  const solved = check === "correct"
  const unused = remainingTokens(pool, built)
  const complete = built.length === correctOrder.length

  function updateBuilt(next: string[] | ((items: string[]) => string[])) {
    if (solved) return
    setBuilt((current) => {
      const value = typeof next === "function" ? next(current) : next
      return value
    })
    setCheck("idle")
  }

  function placeGhost(x: number, y: number) {
    const ghost = ghostRef.current
    if (!ghost) return
    ghost.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
  }

  function startDrag(
    event: ReactPointerEvent<HTMLButtonElement>,
    from: "pool" | "built",
    index: number,
    token: string,
  ) {
    if (solved) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      token,
      from,
      index,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      moved: false,
      activated: false,
    }
    const ghost = ghostRef.current
    if (ghost) {
      ghost.textContent = token
      ghost.dataset.show = "false"
      placeGhost(event.clientX, event.clientY)
    }
  }

  function moveDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = dragRef.current
    if (!current || event.pointerId !== current.pointerId) return
    event.preventDefault()
    const moved =
      current.moved || Math.hypot(event.clientX - current.originX, event.clientY - current.originY) > 6
    current.moved = moved
    if (!moved) return
    if (!current.activated) {
      current.activated = true
      setDraggingId(`${current.from}-${current.index}`)
    }

    const ghost = ghostRef.current
    if (ghost) ghost.dataset.show = "true"

    cancelAnimationFrame(frameRef.current)
    const x = event.clientX
    const y = event.clientY
    frameRef.current = requestAnimationFrame(() => placeGhost(x, y))

    const tray = trayRef.current
    if (!tray) return
    const bounds = tray.getBoundingClientRect()
    const inside = y >= bounds.top - 20 && y <= bounds.bottom + 20 && x >= bounds.left && x <= bounds.right
    insertRef.current = inside ? indexFromPoint(tray, x) : null
    if (inside !== overRef.current) {
      overRef.current = inside
      setOverTray(inside)
    }
  }

  function endDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = dragRef.current
    if (!current || event.pointerId !== current.pointerId) return
    cancelAnimationFrame(frameRef.current)
    const at = insertRef.current
    if (!current.moved) {
      if (current.from === "pool") updateBuilt((items) => [...items, current.token])
      else updateBuilt((items) => items.filter((_, index) => index !== current.index))
    } else if (at != null) {
      updateBuilt((items) => dropToken(items, current, at))
    }
    dragRef.current = null
    insertRef.current = null
    overRef.current = false
    setDraggingId(null)
    setOverTray(false)
    const ghost = ghostRef.current
    if (ghost) ghost.dataset.show = "false"
  }

  function submit() {
    if (!complete || solved) return
    if (built.join("|") === correctOrder.join("|")) {
      setCheck("correct")
      onSolved()
      return
    }
    setCheck("wrong")
  }

  function showAnswer() {
    if (solved) return
    setBuilt(correctOrder)
    setCheck("correct")
    onSolved()
  }

  return (
    <div className="space-y-4">
      {prompt ? <p className="text-sm text-muted-foreground">{prompt}</p> : null}
      <div className="relative">
        <div
          ref={trayRef}
          dir="rtl"
          lang="ar"
          className={cn(
            "flex min-h-20 flex-wrap items-center justify-start gap-2 rounded-3xl border border-dashed bg-paper p-3 transition-colors",
            solved
              ? "border-sage bg-sage/10"
              : check === "wrong"
                ? "border-terracotta/70 bg-terracotta/5"
                : overTray
                  ? "border-sage bg-sage/10"
                  : "border-border",
          )}
        >
          {built.map((token, index) => (
            <Chip
              key={`built-${token}-${index}`}
              token={token}
              built
              dimmed={draggingId === `built-${index}`}
              locked={solved}
              dataIndex={index}
              onPointerDown={(event) => startDrag(event, "built", index, token)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
          ))}
        </div>
        {built.length === 0 ? (
          <p
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted-foreground"
            dir="ltr"
            lang="en"
          >
            The sentence is built here
          </p>
        ) : null}
      </div>
      {!solved ? (
        <div dir="rtl" lang="ar" className="flex flex-wrap justify-start gap-2">
          {unused.map((token, index) => (
            <Chip
              key={`pool-${token}-${index}`}
              token={token}
              dimmed={draggingId === `pool-${index}`}
              onPointerDown={(event) => startDrag(event, "pool", index, token)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
          ))}
        </div>
      ) : null}
      <div
        ref={ghostRef}
        data-show="false"
        dir="rtl"
        lang="ar"
        className="arabic-text pointer-events-none fixed top-0 left-0 z-50 rounded-full bg-sage px-3 py-2 text-xl text-white shadow-lg will-change-transform data-[show=false]:hidden"
      />
      {!solved ? (
        <>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => updateBuilt([])}>
              {t("play.reset")}
            </Button>
            <Button className="flex-1" variant="terracotta" disabled={!complete} onClick={submit}>
              {t("play.submit")}
            </Button>
          </div>
          {check === "wrong" ? (
            <p className="text-sm text-muted-foreground">{t("play.phraseNotQuite")}</p>
          ) : null}
          <button
            type="button"
            className="text-sm font-medium text-terracotta underline-offset-2 hover:underline"
            onClick={showAnswer}
          >
            {t("play.showAnswer")}
          </button>
        </>
      ) : null}
    </div>
  )
}

function Chip({
  token,
  built,
  dimmed,
  locked,
  dataIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  token: string
  built?: boolean
  dimmed?: boolean
  locked?: boolean
  dataIndex?: number
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      data-built-index={dataIndex}
      disabled={locked}
      className={cn(
        "arabic-text touch-none rounded-full px-3 py-2 text-xl select-none",
        locked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        built ? "bg-secondary" : "border border-border bg-card",
        dimmed && "opacity-40",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {token}
    </button>
  )
}

function remainingTokens(tokens: string[], built: string[]) {
  const remaining = [...tokens]
  for (const token of built) {
    const index = remaining.indexOf(token)
    if (index >= 0) remaining.splice(index, 1)
  }
  return remaining
}

function indexFromPoint(tray: HTMLElement, clientX: number) {
  const chips = [...tray.querySelectorAll<HTMLElement>("[data-built-index]")]
  if (chips.length === 0) return 0
  for (let index = 0; index < chips.length; index += 1) {
    const box = chips[index].getBoundingClientRect()
    if (clientX > box.left + box.width / 2) return index
  }
  return chips.length
}

function dropToken(
  current: string[],
  drag: DragState,
  insertAt: number,
) {
  if (drag.from === "pool") {
    const next = [...current]
    next.splice(insertAt, 0, drag.token)
    return next
  }
  const without = current.filter((_, index) => index !== drag.index)
  const dest = drag.index < insertAt ? insertAt - 1 : insertAt
  without.splice(Math.max(0, dest), 0, drag.token)
  return without
}
