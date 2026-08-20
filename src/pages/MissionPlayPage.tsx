import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { MissionPlayer } from "@/components/mission/MissionPlayer"
import { BackButton } from "@/components/app-shell/BackButton"
import { isLessonImplemented, isMissionImplemented } from "@/data/learning/availability"
import { getMission } from "@/data/learning/missions"
import { getLesson } from "@/data/learning/lessons"
import { useI18n } from "@/lib/i18n"

export function MissionPlayPage() {
  const { id = "" } = useParams()
  const mission = getMission(id)
  if (!isMissionImplemented(id) || !mission?.playable) {
    return (
      <div className="py-16">
        <BackButton />
        <div className="text-center">
          <p className="font-display text-2xl">This mission is not playable yet</p>
          <p className="mt-2 text-sm text-muted-foreground">It is on the path as a placeholder card.</p>
        </div>
      </div>
    )
  }
  return <MissionPlayer key={id} experienceId={id} skipIntro />
}

export function LessonPage() {
  const { id = "" } = useParams()
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const from = search.get("from")
  const returnTo = from === "study" ? "/study" : from ? `/missions/${from}` : undefined
  const lesson = getLesson(id)
  if (!lesson) {
    return (
      <div className="py-16 text-center">
        <BackButton />
        <p className="font-display text-2xl">Lesson not found</p>
      </div>
    )
  }
  if (!isLessonImplemented(id) || !lesson.playable) {
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
    <MissionPlayer
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
