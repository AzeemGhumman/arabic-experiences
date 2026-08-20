import type { ReactNode } from "react"
import { getLearningWord } from "@/data/learning/words"
import { cn } from "@/lib/utils"

export function RegisterBadge({ register }: { register?: string }) {
  if (register === "saudi-colloquial") {
    return <span className="rounded-full bg-gold-soft/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Saudi everyday</span>
  }
  if (register === "msa") {
    return <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Formal Arabic</span>
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
  const word = getLearningWord(id)
  if (!word) return null
  return (
    <div className="rounded-2xl border border-border bg-paper px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="arabic-text text-2xl">{word.arabic}</p>
        <RegisterBadge register={word.register} />
      </div>
      {showTransliteration ? <p className="mt-1 text-sm italic text-ink-soft">{word.transliteration}</p> : null}
      {showTranslation ? <p className="mt-1 text-sm">{word.meaning}</p> : null}
    </div>
  )
}

export function OptionButton({
  selected,
  correct,
  revealed,
  onClick,
  children,
}: {
  selected?: boolean
  correct?: boolean
  revealed?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 w-full rounded-2xl border px-4 py-3 text-start text-sm font-semibold",
        revealed && correct
          ? "border-sage bg-sage/15 text-sage-deep"
          : revealed && selected && !correct
            ? "border-destructive/40 bg-destructive/10"
            : selected
              ? "border-terracotta bg-terracotta/10"
              : "border-border bg-paper",
      )}
    >
      {children}
    </button>
  )
}
