import { Volume2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { haramExperience } from "@/data/umrah"

export function SupplicationCard({
  showTransliteration,
  showTranslation,
  onToggleTransliteration,
  onToggleTranslation,
  onPractice,
  practiced,
}: {
  showTransliteration: boolean
  showTranslation: boolean
  onToggleTransliteration: (value: boolean) => void
  onToggleTranslation: (value: boolean) => void
  onPractice: () => void
  practiced: boolean
}) {
  const [listening, setListening] = useState(false)
  const dua = haramExperience.supplication

  return (
    <section className="rounded-3xl border border-gold-soft bg-linear-to-br from-paper to-gold-soft/30 p-5">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
        Arrival supplication
      </p>
      <h3 className="font-display mt-1 text-xl">{dua.title}</h3>
      <p className="arabic-text mt-4 text-3xl leading-relaxed">{dua.arabic}</p>
      {showTransliteration && (
        <p className="mt-3 text-base italic text-ink-soft">{dua.transliteration}</p>
      )}
      {showTranslation && <p className="mt-2 text-base">{dua.translation}</p>}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{dua.note}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={showTransliteration} onCheckedChange={onToggleTransliteration} />
          Transliteration
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={showTranslation} onCheckedChange={onToggleTranslation} />
          Translation
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setListening(true)
            window.setTimeout(() => setListening(false), 1400)
          }}
        >
          <Volume2 />
          {listening ? "Listening…" : "Listen"}
        </Button>
        <Button type="button" variant="terracotta" onClick={onPractice}>
          {practiced ? "Practiced" : "Practice"}
        </Button>
      </div>
    </section>
  )
}
