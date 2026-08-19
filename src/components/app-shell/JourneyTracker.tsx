import { Link } from "react-router-dom"
import { HomeAboutButton } from "@/components/home/HomeAboutButton"
import { LoginMockButton } from "@/components/app-shell/LoginMockButton"
import { useActiveJourney } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function JourneyTracker() {
  const { journey, stats } = useActiveJourney()
  const { t, journey: journeyCopy } = useI18n()
  const copy = journeyCopy(journey.category)
  const percent = stats.total > 0 ? stats.percent : 0

  return (
    <div className="flex items-center gap-2 border-b border-border/80 bg-paper/90 px-3 py-2 backdrop-blur-md sm:px-5">
      <div className="flex w-[4.5rem] shrink-0" aria-hidden />
      <Link to="/" className="min-w-0 flex-1 text-center">
        <span className="font-display block truncate text-lg leading-tight">{copy.title}</span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-none text-ink-soft">
          {t("common.percentComplete", { percent })}
        </span>
      </Link>
      <div className="flex w-[4.5rem] shrink-0 items-center justify-end gap-1.5">
        <HomeAboutButton variant="icon" />
        <LoginMockButton />
      </div>
    </div>
  )
}
