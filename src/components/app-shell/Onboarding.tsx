import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import type { JourneyCategory } from "@/lib/storage"
import { cn } from "@/lib/utils"

const journeyIds: JourneyCategory[] = ["umrah", "hajj", "arabic", "quran"]

export function Onboarding() {
  const { state, completeOnboarding } = useAppState()
  const { t, journey } = useI18n()
  const [journeyId, setJourneyId] = useState<JourneyCategory>("umrah")

  if (state.onboardingComplete) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#3a2f26]/35 p-4 backdrop-blur-[2px] sm:items-center">
      <section className="w-full max-w-md rounded-[2rem] border border-border bg-paper p-6 shadow-2xl">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-ink-soft uppercase">{t("onboarding.kicker")}</p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{t("onboarding.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.body")}</p>
        <div className="mt-5 space-y-2">
          {journeyIds.map((id) => {
            const selected = journeyId === id
            const copy = journey(id)
            return (
              <button
                key={id}
                type="button"
                onClick={() => setJourneyId(id)}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 text-start transition",
                  selected
                    ? "border-terracotta bg-terracotta/10"
                    : "border-border bg-cream hover:border-terracotta/40",
                )}
              >
                <p className="font-semibold">{copy.onboardingLabel}</p>
                <p className="text-sm text-muted-foreground">{copy.onboardingHint}</p>
              </button>
            )
          })}
        </div>
        <Button className="mt-5 w-full" size="lg" onClick={() => completeOnboarding(journeyId)}>
          {t("common.enter")}
        </Button>
      </section>
    </div>
  )
}
