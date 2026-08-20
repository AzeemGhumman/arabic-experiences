import { Link, Navigate } from "react-router-dom"
import { JourneyMap } from "@/components/journey/JourneyMap"
import { Badge } from "@/components/ui/badge"
import { companionTools, hasTripCompanion } from "@/data/companion"
import { umrahSteps } from "@/data/umrah"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function CompanionPage() {
  const { state } = useAppState()
  const { t } = useI18n()

  if (!hasTripCompanion(state.activeJourneyId)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6 pb-8">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.2em] text-terracotta uppercase">{t("companion.kicker")}</p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{t("companion.titleUmrah")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("companion.body")}</p>
      </header>

      <section>
        <h2 className="font-display text-xl">{t("companion.ritesTitle")}</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">{t("companion.ritesBody")}</p>
        <JourneyMap steps={umrahSteps} />
        <Link
          to="/companion/umrah/haram"
          className="mt-4 flex min-h-11 items-center justify-center rounded-full border border-border font-semibold"
        >
          {t("companion.openHaram")}
        </Link>
      </section>

      <section>
        <h2 className="font-display text-xl">{t("companion.laterTitle")}</h2>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">{t("companion.laterBody")}</p>
        <div className="space-y-3">
          {companionTools.map((tool) => (
            <article key={tool.id} className="rounded-3xl border border-dashed border-border bg-card/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg">{tool.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.subtitle}</p>
                </div>
                <Badge className="bg-gold-soft/70 text-ink">{t("journeys.statusComingSoon")}</Badge>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">{t("companion.disclaimer")}</p>
    </div>
  )
}
