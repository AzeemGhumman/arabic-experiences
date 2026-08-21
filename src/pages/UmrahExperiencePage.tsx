import { Link, Navigate } from "react-router-dom"
import { ContextCard } from "@/components/scene/ContextCard"
import { HaramScene } from "@/components/scene/Scenes"
import { SupplicationCard } from "@/components/vocabulary/SupplicationCard"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { BackButton } from "@/components/app-shell/BackButton"

export function UmrahExperiencePage() {
  const { t } = useI18n()
  const { state, setShowTransliteration, setShowTranslation, practiceSupplication } =
    useAppState()

  if (state.activeJourneyId !== "umrah") {
    return <Navigate to="/" replace />
  }

  const notices = [
    t("companion.haramExperience.notice1"),
    t("companion.haramExperience.notice2"),
    t("companion.haramExperience.notice3"),
    t("companion.haramExperience.notice4"),
  ]

  return (
    <div className="space-y-5 pb-10">
      <header>
        <BackButton />
        <p className="text-[11px] font-semibold tracking-[0.2em] text-terracotta uppercase">
          {t("companion.haramExperience.kicker")}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">
          {t("companion.haramExperience.title")}
        </h1>
        <p className="mt-2 text-sm italic text-ink-soft">
          {t("companion.haramExperience.atmosphere")}
        </p>
      </header>

      <div className="overflow-hidden rounded-[1.75rem] border border-border shadow-sm">
        <HaramScene />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {t("companion.haramExperience.illustrationPlaceholder")}
      </p>

      <ContextCard title={t("companion.haramExperience.momentTitle")}>
        {t("companion.haramExperience.context")}
      </ContextCard>

      <ContextCard title={t("companion.haramExperience.historyTitle")}>
        <p>{t("companion.haramExperience.historicalNote")}</p>
      </ContextCard>

      <SupplicationCard
        showTransliteration={state.showTransliteration}
        showTranslation={state.showTranslation}
        onToggleTransliteration={setShowTransliteration}
        onToggleTranslation={setShowTranslation}
        onPractice={() => practiceSupplication("haram-arrival")}
        practiced={state.practicedSupplications.includes("haram-arrival")}
      />

      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {t("companion.haramExperience.noticeTitle")}
        </p>
        <ul className="mt-3 space-y-2.5">
          {notices.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <Button className="w-full" size="lg" variant="terracotta" asChild>
        <Link to="/companion">{t("companion.backToCompanion")}</Link>
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("companion.haramExperience.disclaimer")}
      </p>
    </div>
  )
}
