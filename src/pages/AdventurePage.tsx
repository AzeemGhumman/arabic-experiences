import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { AdventurePlayer } from "@/components/adventure/AdventurePlayer"
import { BackButton } from "@/components/app-shell/BackButton"
import { isMissionImplemented, isPrepImplemented } from "@/data/learning/availability"
import { getAdventure } from "@/data/learning/adventures"
import { getSideMission } from "@/data/learning/side-missions"
import { useI18n } from "@/lib/i18n"

export function AdventurePage() {
  const { id = "" } = useParams()
  const adventure = getAdventure(id)
  if (!isMissionImplemented(id) || !adventure?.playable) {
    return (
      <div className="py-16">
        <BackButton />
        <div className="text-center">
          <p className="font-display text-2xl">This adventure is not playable yet</p>
          <p className="mt-2 text-sm text-muted-foreground">It is on the path as a placeholder card.</p>
        </div>
      </div>
    )
  }
  return <AdventurePlayer key={id} experienceId={id} skipIntro />
}

export function SideMissionPage() {
  const { id = "" } = useParams()
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const from = search.get("from")
  const returnTo = from === "prep" ? "/prep" : from ? `/missions/${from}` : undefined
  const mission = getSideMission(id)
  if (!mission) {
    return (
      <div className="py-16 text-center">
        <BackButton />
        <p className="font-display text-2xl">Prep session not found</p>
      </div>
    )
  }
  if (!isPrepImplemented(id) || !mission.playable) {
    return (
      <div className="space-y-5 py-16">
        <BackButton />
        <div className="rounded-3xl border border-border bg-card px-5 py-10 text-center">
          <p className="font-display text-2xl leading-tight">{t("mission.comingSoonTitle")}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("mission.comingSoonBody")}</p>
        </div>
      </div>
    )
  }
  return (
    <AdventurePlayer
      key={`${id}-${from ?? ""}`}
      experienceId={id}
      returnTo={returnTo}
      onStudyComplete={
        returnTo
          ? () => {
              navigate(returnTo, { replace: true })
            }
          : undefined
      }
    />
  )
}
