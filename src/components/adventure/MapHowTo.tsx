import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export function MapHowTo({
  nextPlace,
  nextHref,
  onDismiss,
}: {
  nextPlace?: string
  nextHref?: string
  onDismiss: () => void
}) {
  const { t } = useI18n()

  return (
    <section className="rounded-[1.75rem] border border-terracotta/35 bg-paper px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-lg leading-tight">{t("map.howTitle")}</h2>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          aria-label={t("map.howDismiss")}
        >
          <X className="size-4" />
        </button>
      </div>
      <ol className="mt-3 space-y-2.5 text-sm leading-snug text-ink-soft">
        <li className="flex gap-2.5">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-[11px] font-semibold text-terracotta">
            1
          </span>
          <span>{t("map.howMission")}</span>
        </li>
        <li className="flex gap-2.5">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-[11px] font-semibold text-terracotta">
            2
          </span>
          <span>{t("map.howPrep")}</span>
        </li>
        <li className="flex gap-2.5">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-[11px] font-semibold text-terracotta">
            3
          </span>
          <span>{t("map.howGuide")}</span>
        </li>
      </ol>
      <div className="mt-4 flex flex-col gap-2">
        {nextHref && nextPlace ? (
          <Button asChild className="w-full" size="lg">
            <Link to={nextHref} onClick={onDismiss}>
              {t("map.howStart", { place: nextPlace })}
            </Link>
          </Button>
        ) : null}
        <Button variant="ghost" className="w-full" onClick={onDismiss}>
          {t("map.howDismiss")}
        </Button>
      </div>
    </section>
  )
}
