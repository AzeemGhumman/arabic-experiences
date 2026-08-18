import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { JourneyCard } from "@/components/journey/JourneyCard"
import { BackButton } from "@/components/app-shell/BackButton"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { journeys } from "@/data/journeys"
import { useActiveJourney } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import type { Journey } from "@/lib/storage"

export function JourneySwitchPage() {
  const { journey, stats, setActiveJourney } = useActiveJourney()
  const { t, journey: journeyCopy } = useI18n()
  const navigate = useNavigate()
  const [pending, setPending] = useState<Journey | null>(null)
  const others = journeys.filter((item) => item.id !== journey.id)
  const currentCopy = journeyCopy(journey.category)
  const pendingCopy = pending ? journeyCopy(pending.category) : null

  function confirmSwitch() {
    if (!pending) return
    setActiveJourney(pending.category)
    setPending(null)
    navigate("/")
  }

  return (
    <div className="space-y-5 pb-6">
      <header>
        <BackButton to="/profile" />
        <p className="text-[11px] font-semibold tracking-[0.2em] text-ink-soft uppercase">{t("journeys.switchKicker")}</p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{t("journeys.switchTitle")}</h1>
      </header>

      <section className="rounded-[1.75rem] border-2 border-terracotta bg-terracotta/10 p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-terracotta uppercase">{t("journeys.youAreOn")}</p>
        <h2 className="font-display mt-2 text-2xl leading-tight">{currentCopy.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {t("journeys.youAreOnBody", { done: stats.done, total: stats.total })}
        </p>
      </section>

      <JourneyCard journey={journey} featured current />

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">{t("journeys.switchToOther")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("journeys.switchToOtherBody")}</p>
        </div>
        {others.map((item) => (
          <JourneyCard key={item.id} journey={item} featured onSelect={() => setPending(item)} />
        ))}
      </section>

      <Dialog open={Boolean(pending)} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("journeys.switchConfirmTitle", { journey: pendingCopy?.title ?? "" })}</DialogTitle>
            <DialogDescription>
              {t("journeys.switchConfirmBody", {
                current: currentCopy.title,
                journey: pendingCopy?.title ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                {t("common.stayHere")}
              </Button>
            </DialogClose>
            <Button className="flex-1" variant="terracotta" onClick={confirmSwitch}>
              {t("common.switchJourney")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
