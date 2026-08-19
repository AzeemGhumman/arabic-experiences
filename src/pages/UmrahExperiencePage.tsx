import { Link, Navigate } from "react-router-dom"
import { ContextCard } from "@/components/scene/ContextCard"
import { HaramScene } from "@/components/scene/Scenes"
import { SupplicationCard } from "@/components/vocabulary/SupplicationCard"
import { Button } from "@/components/ui/button"
import { haramExperience } from "@/data/umrah"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { BackButton } from "@/components/app-shell/BackButton"

export function UmrahExperiencePage() {
  const { t } = useI18n()
  const { state, setShowTransliteration, setShowTranslation, practiceSupplication } =
    useAppState()

  if (state.activeJourneyId !== "umrah") {
    return <Navigate to={state.activeJourneyId === "hajj" ? "/companion" : "/"} replace />
  }

  return (
    <div className="space-y-5 pb-10">
      <header>
        <BackButton />
        <p className="text-[11px] font-semibold tracking-[0.2em] text-terracotta uppercase">
          {t("companion.kicker")}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{haramExperience.title}</h1>
        <p className="mt-2 text-sm italic text-ink-soft">{haramExperience.atmosphere}</p>
      </header>

      <div className="overflow-hidden rounded-[1.75rem] border border-border shadow-sm">
        <HaramScene />
      </div>
      <p className="text-center text-xs text-muted-foreground">Atmospheric illustration placeholder</p>

      <ContextCard title="In this moment">{haramExperience.context}</ContextCard>

      <ContextCard title="A historical note">
        <p>{haramExperience.historicalNote}</p>
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
          What should I notice?
        </p>
        <ul className="mt-3 space-y-2.5">
          {haramExperience.notice.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <Button
        className="w-full"
        size="lg"
        variant="terracotta"
        asChild
      >
        <Link to="/companion">{t("companion.backToGuide")}</Link>
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">{haramExperience.disclaimer}</p>
    </div>
  )
}
