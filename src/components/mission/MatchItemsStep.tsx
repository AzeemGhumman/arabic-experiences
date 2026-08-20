import { useMemo, useRef, useState, type ReactNode } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { PlayAudioButton } from "@/components/audio/PlayAudioButton"
import { Button } from "@/components/ui/button"
import { shuffleInPlace, useShuffledOptions } from "@/components/mission/MissionBits"
import { vocabItemImage } from "@/data/learning/vocab-item-images"
import { getLearningWord } from "@/data/learning/words"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type SlotState = "idle" | "correct" | "wrong"

type DragState = {
  pictureId: string
  from: "pool" | "slot"
  slotLabelId?: string
  pointerId: number
  originX: number
  originY: number
  moved: boolean
  activated: boolean
}

const MATCH_AUDIO_PACK = "packing-basic"

function MissionArabicLine({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p dir="rtl" className={cn("font-arabic arabic-text text-lg leading-snug text-ink", className)}>
      {children}
    </p>
  )
}

export function MatchItemsStep({
  prompt,
  question,
  itemIds,
  feedback,
  onContinue,
}: {
  prompt: string
  question?: string
  itemIds: string[]
  feedback?: string
  onContinue: () => void
}) {
  const { t } = useI18n()
  const labelOrder = useShuffledOptions(itemIds)
  const [poolOrder] = useState(() => shuffleInPlace([...itemIds]))
  const [assignment, setAssignment] = useState<Record<string, string>>({})
  const [slotState, setSlotState] = useState<Record<string, SlotState>>({})
  const [solved, setSolved] = useState(false)
  const [draggingPictureId, setDraggingPictureId] = useState<string | null>(null)
  const [hoverSlotId, setHoverSlotId] = useState<string | null>(null)

  const ghostRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const hoverSlotRef = useRef<string | null>(null)
  const frameRef = useRef<number>(0)

  const items = useMemo(
    () =>
      itemIds.map((id) => {
        const word = getLearningWord(id)
        return {
          id,
          arabic: word?.arabic ?? id,
          meaning: word?.meaning ?? id,
          imageSrc: vocabItemImage(id),
        }
      }),
    [itemIds],
  )

  const byId = useMemo(() => Object.fromEntries(items.map((item) => [item.id, item])), [items])
  const assignedPictureIds = new Set(Object.values(assignment))
  const pool = poolOrder.filter((id) => !assignedPictureIds.has(id))
  const allFilled = labelOrder.every((labelId) => Boolean(assignment[labelId]))
  const questionText = question ?? t("play.matchItems")

  function pictureInSlot(labelId: string) {
    const pictureId = assignment[labelId]
    return pictureId ? byId[pictureId] : null
  }

  function placeGhost(x: number, y: number) {
    const ghost = ghostRef.current
    if (!ghost) return
    ghost.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
  }

  function slotAtPoint(x: number, y: number) {
    const target = document.elementFromPoint(x, y)
    const slot = target?.closest<HTMLElement>("[data-match-slot]")
    if (!slot) return null
    const labelId = slot.dataset.matchSlot
    if (!labelId || slotState[labelId] === "correct") return null
    return labelId
  }

  function setHoverSlot(labelId: string | null) {
    if (hoverSlotRef.current === labelId) return
    hoverSlotRef.current = labelId
    setHoverSlotId(labelId)
  }

  function placePicture(targetLabelId: string, pictureId: string, sourceLabelId?: string) {
    if (solved || slotState[targetLabelId] === "correct") return
    setAssignment((current) => {
      const next = { ...current }
      const displaced = next[targetLabelId]

      if (targetLabelId === sourceLabelId) {
        next[targetLabelId] = pictureId
        return next
      }

      let fromLabel = sourceLabelId
      if (!fromLabel) {
        for (const [label, assigned] of Object.entries(next)) {
          if (assigned === pictureId) {
            fromLabel = label
            break
          }
        }
      }

      if (fromLabel) delete next[fromLabel]

      if (displaced && fromLabel && fromLabel !== targetLabelId) {
        next[fromLabel] = displaced
      }

      next[targetLabelId] = pictureId
      return next
    })
    setSlotState((current) => {
      const next = { ...current }
      delete next[targetLabelId]
      if (sourceLabelId) delete next[sourceLabelId]
      for (const [otherLabel, state] of Object.entries(next)) {
        if (state === "wrong") delete next[otherLabel]
      }
      return next
    })
  }

  function removeFromSlot(labelId: string) {
    if (solved || slotState[labelId] === "correct") return
    setAssignment((current) => {
      const next = { ...current }
      delete next[labelId]
      return next
    })
    setSlotState((current) => {
      const next = { ...current }
      delete next[labelId]
      return next
    })
  }

  function startDrag(
    event: ReactPointerEvent<HTMLElement>,
    from: "pool" | "slot",
    pictureId: string,
    slotLabelId?: string,
  ) {
    if (solved) return
    if (from === "slot" && slotLabelId && slotState[slotLabelId] === "correct") return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pictureId,
      from,
      slotLabelId,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      moved: false,
      activated: false,
    }
    const ghost = ghostRef.current
    if (ghost) {
      ghost.dataset.show = "false"
      placeGhost(event.clientX, event.clientY)
    }
  }

  function moveDrag(event: ReactPointerEvent<HTMLElement>) {
    const current = dragRef.current
    if (!current || event.pointerId !== current.pointerId) return
    event.preventDefault()
    const moved =
      current.moved || Math.hypot(event.clientX - current.originX, event.clientY - current.originY) > 6
    current.moved = moved
    if (!moved) return

    if (!current.activated) {
      current.activated = true
      setDraggingPictureId(current.pictureId)
      const ghost = ghostRef.current
      if (ghost) ghost.dataset.show = "true"
    }

    cancelAnimationFrame(frameRef.current)
    const x = event.clientX
    const y = event.clientY
    frameRef.current = requestAnimationFrame(() => placeGhost(x, y))
    setHoverSlot(slotAtPoint(x, y))
  }

  function endDrag(event: ReactPointerEvent<HTMLElement>) {
    const current = dragRef.current
    if (!current || event.pointerId !== current.pointerId) return
    cancelAnimationFrame(frameRef.current)

      if (current.activated) {
        const slotId = slotAtPoint(event.clientX, event.clientY)
        if (slotId) {
          placePicture(
            slotId,
            current.pictureId,
            current.from === "slot" ? current.slotLabelId : undefined,
          )
        } else if (current.from === "slot" && current.slotLabelId) {
          removeFromSlot(current.slotLabelId)
        }
      }

    dragRef.current = null
    setDraggingPictureId(null)
    setHoverSlot(null)
    const ghost = ghostRef.current
    if (ghost) ghost.dataset.show = "false"
  }

  function submit() {
    if (!allFilled || solved) return
    const nextState: Record<string, SlotState> = {}
    let allCorrect = true
    for (const labelId of labelOrder) {
      const pictureId = assignment[labelId]
      const ok = pictureId === labelId
      nextState[labelId] = ok ? "correct" : "wrong"
      if (!ok) allCorrect = false
    }
    setSlotState(nextState)
    if (allCorrect) setSolved(true)
  }

  function resetWrong() {
    if (solved) return
    setAssignment((current) => {
      const next = { ...current }
      for (const labelId of labelOrder) {
        if (slotState[labelId] === "wrong") delete next[labelId]
      }
      return next
    })
    setSlotState((current) => {
      const next = { ...current }
      for (const labelId of labelOrder) {
        if (next[labelId] === "wrong") delete next[labelId]
      }
      return next
    })
  }

  function showAnswer() {
    if (solved) return
    const filled: Record<string, string> = {}
    const states: Record<string, SlotState> = {}
    for (const labelId of labelOrder) {
      filled[labelId] = labelId
      states[labelId] = "correct"
    }
    setAssignment(filled)
    setSlotState(states)
    setSolved(true)
  }

  const hasWrong = Object.values(slotState).some((state) => state === "wrong")
  const ghostItem = draggingPictureId ? byId[draggingPictureId] : null

  return (
    <div className="space-y-3">
      <p className="rounded-2xl border border-border/60 bg-secondary/35 px-3 py-2.5 text-sm leading-snug text-muted-foreground">
        {prompt}
      </p>
      <p className="text-sm font-medium text-ink">{questionText}</p>
      {!solved ? <p className="text-xs text-muted-foreground">{t("play.dragMatchHint")}</p> : null}

      <ul className="grid gap-2">
        {labelOrder.map((labelId) => {
          const label = byId[labelId]
          const picture = pictureInSlot(labelId)
          const state = slotState[labelId] ?? "idle"
          const isHover = hoverSlotId === labelId && Boolean(draggingPictureId)
          const droppable = !solved && state !== "correct"
          return (
            <li key={labelId}>
              <div
                data-match-slot={droppable ? labelId : undefined}
                className={cn(
                  "flex items-stretch overflow-hidden rounded-2xl border transition",
                  state === "correct" && "border-sage-deep bg-sage/35",
                  state === "wrong" && "border-destructive/40 bg-destructive/10",
                  state === "idle" && "border-border bg-paper",
                  isHover && droppable && "border-sage bg-sage/10 ring-1 ring-sage/40",
                )}
              >
                <PlayAudioButton
                  packId={MATCH_AUDIO_PACK}
                  clipId={labelId}
                  size="zone"
                  variant="secondary"
                  label={t("play.listen")}
                  className={cn(
                    "rounded-l-2xl",
                    state === "correct" && "border-sage-deep/30 bg-sage/20",
                    state === "wrong" && "border-destructive/20 bg-destructive/5",
                  )}
                />
                {picture?.imageSrc ? (
                  <button
                    type="button"
                    disabled={!droppable}
                    className={cn(
                      "relative w-14 shrink-0 self-stretch touch-none overflow-hidden border-r border-border/60 bg-secondary/35",
                      draggingPictureId === picture.id ? "opacity-30" : "",
                      droppable ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                    )}
                    onPointerDown={(event) => startDrag(event, "slot", picture.id, labelId)}
                    onPointerMove={moveDrag}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    aria-label={picture.meaning}
                  >
                    <img src={picture.imageSrc} alt="" className="size-full object-cover" draggable={false} />
                  </button>
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5">
                  <MissionArabicLine className="w-full text-right">{label?.arabic}</MissionArabicLine>
                  {state === "correct" || solved ? (
                    <p dir="ltr" className="mt-0.5 text-left text-xs text-muted-foreground">
                      {label?.meaning}
                    </p>
                  ) : null}
                  {state === "wrong" && picture ? (
                    <p dir="ltr" className="mt-0.5 text-left text-xs text-terracotta">
                      {t("play.matchWrongPair", {
                        name: label?.meaning ?? "",
                        item: byId[picture.id]?.meaning ?? "",
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {!solved && pool.length > 0 ? (
        <div data-match-pool className="flex flex-wrap gap-2">
          {pool.map((pictureId) => {
            const item = byId[pictureId]
            return (
              <button
                key={pictureId}
                type="button"
                className={cn(
                  "size-20 touch-none overflow-hidden rounded-2xl border bg-card",
                  draggingPictureId === pictureId ? "opacity-30" : "border-border hover:bg-secondary/40",
                  "cursor-grab active:cursor-grabbing",
                )}
                onPointerDown={(event) => startDrag(event, "pool", pictureId)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                aria-label={item?.meaning}
              >
                {item?.imageSrc ? (
                  <img src={item.imageSrc} alt="" className="size-full object-cover" draggable={false} />
                ) : (
                  <span className="flex size-full items-center justify-center p-1 text-center text-[10px] text-muted-foreground">
                    {item?.meaning}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ) : null}

      <div
        ref={ghostRef}
        data-show="false"
        className="pointer-events-none fixed top-0 left-0 z-50 size-20 overflow-hidden rounded-2xl border-2 border-sage bg-card shadow-lg will-change-transform data-[show=false]:hidden"
      >
        {ghostItem?.imageSrc ? (
          <img src={ghostItem.imageSrc} alt="" className="size-full object-cover" draggable={false} />
        ) : null}
      </div>

      {!solved ? (
        <>
          <div className="flex gap-2">
            {hasWrong ? (
              <Button variant="outline" className="flex-1" onClick={resetWrong}>
                {t("play.resetWrong")}
              </Button>
            ) : null}
            <Button className="flex-1" variant="terracotta" disabled={!allFilled} onClick={submit}>
              {t("play.submit")}
            </Button>
          </div>
          {hasWrong ? <p className="text-sm text-muted-foreground">{t("play.matchNotQuite")}</p> : null}
          <button
            type="button"
            className="text-sm font-medium text-terracotta underline-offset-2 hover:underline"
            onClick={showAnswer}
          >
            {t("play.showAnswer")}
          </button>
        </>
      ) : null}

      {solved && feedback ? (
        <p className="rounded-2xl bg-sage/10 px-4 py-3 text-sm leading-relaxed text-sage-deep">{feedback}</p>
      ) : null}

      <Button className="w-full" variant="terracotta" disabled={!solved} onClick={onContinue}>
        {t("play.continue")}
      </Button>
    </div>
  )
}
