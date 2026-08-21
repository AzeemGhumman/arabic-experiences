import { Volume2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { haramExperience } from "@/data/umrah"
import { useI18n } from "@/lib/i18n"

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
  const { t, language } = useI18n()
  const [listening, setListening] = useState(false)
  const dua = haramExperience.supplication
  const latinHelp = language === "en"
  const transliterationOn = latinHelp && showTransliteration

  return (
    <section className="rounded-3xl border border-gold-soft bg-linear-to-br from-paper to-gold-soft/30 p-5">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
        {t("companion.haramExperience.duaTitle")}
      </p>
      <h3 className="font-display mt-1 text-xl">{t("companion.haramExperience.duaTitle")}</h3>
      <p className="arabic-text mt-4 text-3xl leading-relaxed">{dua.arabic}</p>
      {transliterationOn && (
        <p className="mt-3 text-base italic text-ink-soft">{dua.transliteration}</p>
      )}
      {showTranslation && (
        <p className="mt-2 text-base">{t("companion.haramExperience.duaTranslation")}</p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {t("companion.haramExperience.duaNote")}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {latinHelp ? (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={showTransliteration} onCheckedChange={onToggleTransliteration} />
            {t("companion.dua.transliteration")}
          </label>
        ) : null}
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={showTranslation} onCheckedChange={onToggleTranslation} />
          {t("companion.dua.translation")}
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
          {listening ? t("companion.dua.listening") : t("companion.dua.listen")}
        </Button>
        <Button type="button" variant="terracotta" onClick={onPractice}>
          {practiced ? t("companion.dua.practiced") : t("companion.dua.practice")}
        </Button>
      </div>
    </section>
  )
}
