import { useState } from "react"
import type { ReactNode } from "react"
import { getLearningWord } from "@/data/learning/words"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export type OptionVisualState = "idle" | "wrong" | "correct"

export function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = items[i]
    items[i] = items[j]!
    items[j] = current!
  }
  return items
}

function sameOrder<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((item, index) => item === b[index])
}

/** Shuffle until the result differs from `avoid` (for phrase pools that must not start solved). */
export function shuffleAvoidingOrder<T>(items: T[], avoid: T[]): T[] {
  if (items.length <= 1) return [...items]
  const copy = [...items]
  for (let attempt = 0; attempt < 24; attempt += 1) {
    shuffleInPlace(copy)
    if (!sameOrder(copy, avoid)) return copy
  }
  if (copy.length >= 2) {
    const swap = copy[1]!
    copy[1] = copy[0]!
    copy[0] = swap
  }
  return copy
}

/** Stable random order for the lifetime of the mounted step. */
export function useShuffledOptions<T>(items: T[]): T[] {
  const [shuffled] = useState(() => shuffleInPlace([...items]))
  return shuffled
}

/** MCQ selection: wrong tries stay retryable; correct answer locks the step. */
export function useMcqAnswer(correctId: string) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const solved = selectedId === correctId

  function select(id: string) {
    if (solved) return
    setSelectedId(id)
  }

  function optionState(optionId: string): OptionVisualState {
    if (solved && optionId === correctId) return "correct"
    if (!solved && selectedId === optionId) return "wrong"
    return "idle"
  }

  function showOptionDetail(optionId: string) {
    return selectedId === optionId || (solved && optionId === correctId)
  }

  return { solved, select, optionState, showOptionDetail, selectedId }
}

/** Arabic visibility for audio MCQ options — optional hint, reveal-on-wrong, reveal-all on solve. */
export function useMcqArabicHints(correctId: string) {
  const mcq = useMcqAnswer(correctId)
  const [hintRevealed, setHintRevealed] = useState(false)
  const [wrongRevealedIds, setWrongRevealedIds] = useState<Set<string>>(() => new Set())

  function select(id: string) {
    if (mcq.solved) return
    mcq.select(id)
    if (id !== correctId) {
      setWrongRevealedIds((prev) => new Set(prev).add(id))
    }
  }

  function showArabicForOption(optionId: string) {
    if (hintRevealed) return true
    if (mcq.solved) return true
    return wrongRevealedIds.has(optionId)
  }

  return {
    ...mcq,
    select,
    hintRevealed,
    revealHint: () => setHintRevealed(true),
    showArabicForOption,
  }
}

export function RegisterBadge({ register }: { register?: string }) {
  const { t } = useI18n()
  if (register === "saudi-colloquial") {
    return (
      <span className="rounded-full bg-gold-soft/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
        {t("common.saudiEveryday")}
      </span>
    )
  }
  if (register === "msa") {
    return (
      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
        {t("common.formalArabic")}
      </span>
    )
  }
  return null
}

export function VocabularyChip({
  id,
  showTransliteration,
  showTranslation,
}: {
  id: string
  showTransliteration: boolean
  showTranslation: boolean
}) {
  const { word: gloss } = useI18n()
  const word = getLearningWord(id)
  if (!word) return null
  return (
    <div className="rounded-2xl border border-border bg-paper px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="arabic-text text-2xl">{word.arabic}</p>
        <RegisterBadge register={word.register} />
      </div>
      {showTransliteration ? <p className="mt-1 text-sm italic text-ink-soft">{word.transliteration}</p> : null}
      {showTranslation ? <p className="mt-1 text-sm">{gloss(id, word.meaning)}</p> : null}
    </div>
  )
}

export function OptionButton({
  state = "idle",
  disabled,
  onClick,
  children,
}: {
  state?: OptionVisualState
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-12 w-full rounded-2xl border px-4 py-3 text-start text-sm font-semibold",
        state === "correct"
          ? "border-sage-deep bg-sage/35 text-sage-deep"
          : state === "wrong"
            ? "border-destructive/40 bg-destructive/10"
            : "border-border bg-paper",
        disabled && state === "idle" && "opacity-60",
      )}
    >
      {children}
    </button>
  )
}
