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
      <section className="w-full max-w-md rounded-[1.75rem] border border-border bg-paper p-5 shadow-2xl">
        <h1 className="font-display text-[2.15rem] leading-[1.05] tracking-tight">{t("onboarding.title")}</h1>
        <p className="font-display mt-1.5 text-lg leading-snug text-ink-soft">{t("onboarding.subtitle")}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t("onboarding.body")}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {journeyIds.map((id) => {
            const released = isJourneyReleased(id)
            const copy = journey(id)
            return (
              <div
                key={id}
                aria-disabled={!released}
                className={cn(
                  "flex min-h-[4.5rem] flex-col justify-center rounded-2xl border px-3 py-3 text-start",
                  released ? "border-terracotta bg-terracotta/10" : "border-border bg-cream opacity-70",
                )}
              >
                <p className="font-semibold leading-tight">{copy.onboardingLabel}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  {released ? copy.onboardingHint : t("journeys.statusComingSoon")}
                </p>
              </div>
            )
          })}
        </div>
        <Button className="mt-4 w-full" size="lg" onClick={() => completeOnboarding("umrah")}>
          {t("onboarding.cta")}
        </Button>
      </section>
    </div>
  )
}
