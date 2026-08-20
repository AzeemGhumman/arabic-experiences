import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { languageOptions } from "@/locales"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { useTabNavigation } from "@/lib/tab-navigation"
import type { UiLanguage } from "@/lib/storage"

export function ProfilePage() {
  const { resetTabToRoot } = useTabNavigation()
  const { state, setLanguage, deleteAllData } = useAppState()
  const { t, journey: journeyCopy } = useI18n()
  const { journey, stats } = useActiveJourney()
  const copy = journeyCopy(journey.category)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="space-y-5 pb-10">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.2em] text-ink-soft uppercase">{t("profile.kicker")}</p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{t("profile.title")}</h1>
      </header>

      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {t("profile.activeJourney")}
        </p>
        <h2 className="font-display mt-2 text-2xl leading-tight">{copy.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("profile.activeJourneyBody", { done: stats.done, total: stats.total })}
        </p>
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link to="/profile/journeys">{t("profile.switchJourney")}</Link>
        </Button>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {t("profile.interfaceLanguage")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{t("profile.interfaceLanguageBody")}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {languageOptions().map((language) => (
            <button
              key={language.id}
              type="button"
              dir={language.id === "en" ? "ltr" : undefined}
              onClick={() => setLanguage(language.id as UiLanguage)}
              className={`rounded-2xl border px-3 py-3 text-sm ${
                language.id === "en" ? "text-start" : "text-end"
              } ${
                state.language === language.id
                  ? "border-terracotta bg-terracotta/10"
                  : "border-border bg-paper"
              }`}
            >
              <p className="font-display text-base font-semibold leading-snug">{language.native}</p>
              {language.native !== language.label ? (
                <p className="text-muted-foreground text-xs" dir="ltr" lang="en">
                  {language.label}
                </p>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">{t("profile.yourData")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("profile.yourDataBody")}</p>
        <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="mt-3 w-full text-muted-foreground">
              {t("profile.deleteData")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("profile.deleteTitle")}</DialogTitle>
              <DialogDescription>{t("profile.deleteBody")}</DialogDescription>
            </DialogHeader>
            <div className="mt-5 flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">
                  {t("common.keepData")}
                </Button>
              </DialogClose>
              <Button
                className="flex-1"
                variant="terracotta"
                onClick={() => {
                  setConfirmDelete(false)
                  deleteAllData()
                  resetTabToRoot("home")
                }}
              >
                {t("common.deleteEverything")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}
