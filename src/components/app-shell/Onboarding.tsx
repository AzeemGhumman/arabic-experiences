import { Button } from "@/components/ui/button"
import { isJourneyReleased } from "@/data/journeys"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import type { JourneyCategory } from "@/lib/storage"
import { cn } from "@/lib/utils"

const journeyIds: JourneyCategory[] = ["umrah", "hajj", "arabic", "quran"]

export function Onboarding() {
  const { state, completeOnboarding } = useAppState()
  const { t, journey } = useI18n()

  if (state.onboardingComplete) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#3a2f26]/35 p-4 backdrop-blur-[2px] sm:items-center">
      <section className="w-full max-w-md rounded-[2rem] border border-border bg-paper p-6 shadow-2xl">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-ink-soft uppercase">{t("onboarding.kicker")}</p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{t("onboarding.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.body")}</p>
        <div className="mt-5 space-y-2">
          {journeyIds.map((id) => {
            const released = isJourneyReleased(id)
            const selected = released
            const copy = journey(id)
            return (
              <div
                key={id}
                aria-disabled={!released}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 text-start",
                  selected
                    ? "border-terracotta bg-terracotta/10"
                    : "border-border bg-cream opacity-70",
                )}
              >
                <p className="flex items-center justify-between gap-2 font-semibold">
                  <span>{copy.onboardingLabel}</span>
                  {released ? null : (
                    <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                      {t("journeys.statusComingSoon")}
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{copy.onboardingHint}</p>
              </div>
            )
          })}
        </div>
        <Button className="mt-5 w-full" size="lg" onClick={() => completeOnboarding("umrah")}>
          {t("common.enter")}
        </Button>
      </section>
    </div>
  )
}
