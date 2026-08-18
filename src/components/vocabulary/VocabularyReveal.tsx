import { useState } from "react"
import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VocabularyItem } from "@/lib/storage"
import { cn } from "@/lib/utils"

export function VocabularyReveal({
  item,
  showTransliteration,
  showTranslation,
  notice,
  contextLabel = "Noticed on the table",
  compact = false,
}: {
  item: VocabularyItem
  showTransliteration: boolean
  showTranslation: boolean
  notice?: string
  contextLabel?: string
  compact?: boolean
}) {
  const [playing, setPlaying] = useState(false)

  function playAudio() {
    setPlaying(true)
    window.setTimeout(() => setPlaying(false), 1200)
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-paper p-5 shadow-sm",
        compact && "p-4",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {contextLabel}
        </p>
        <Button
          type="button"
          size="icon"
          variant={playing ? "terracotta" : "secondary"}
          aria-label={`Play pronunciation for ${item.meaning}`}
          onClick={playAudio}
        >
          <Volume2 />
        </Button>
      </div>
      {notice ? <p className="mt-2 text-sm text-muted-foreground">{notice}</p> : null}
      <p className="arabic-text mt-3 text-4xl font-semibold text-ink">{item.arabic}</p>
      {showTransliteration ? (
        <div className="mt-2 space-y-1">
          <p className="text-base text-ink-soft italic">{item.transliteration}</p>
          {item.ipa ? <p className="text-sm text-muted-foreground">{item.ipa}</p> : null}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Stay with the picture and the Arabic first.
        </p>
      )}
      {showTranslation ? (
        <p className="mt-1 text-lg font-medium">{item.meaning}</p>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">
          Meaning stays hidden until you choose to reveal it.
        </p>
      )}
      {showTranslation && item.example ? (
        <p className="arabic-text mt-3 text-xl text-sage-deep">{item.example}</p>
      ) : null}
      {showTranslation && item.phrases?.[0] ? (
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="arabic-text text-lg text-sage-deep">{item.phrases[0].arabic}</span>
          {showTransliteration ? ` · ${item.phrases[0].transliteration}` : ""}
          {` · ${item.phrases[0].meaning}`}
        </p>
      ) : null}
    </div>
  )
}
