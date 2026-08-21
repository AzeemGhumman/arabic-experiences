import { useEffect } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { MissionPlayer } from "@/components/mission/MissionPlayer"
import { BackButton } from "@/components/app-shell/BackButton"
import { canStartMission, isLessonImplemented, isMissionImplemented } from "@/data/learning/availability"
import { returnPathFromFromParam } from "@/lib/navigation"
import { graphForJourney } from "@/data/learning/mission-graph"
import { getMission } from "@/data/learning/missions"
import { getLesson } from "@/data/learning/lessons"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function MissionPlayPage() {
  const { id = "" } = useParams()
  const [search] = useSearchParams()
  const { t } = useI18n()
  const { state } = useAppState()
  const { progress } = useActiveJourney()
  const mission = getMission(id)
  const graph = graphForJourney(state.activeJourneyId)
  const node = graph?.nodes.find((item) => item.id === id)
  const from = search.get("from")
  const returnTo = returnPathFromFromParam(from) ?? `/missions/${id}`

  if (!isMissionImplemented(id) || !mission?.playable) {
    return (
      <div className="py-16">
        <BackButton to={returnTo} />
        <div className="text-center">
          <p className="font-display text-2xl">{t("mission.notPlayableYet")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("mission.notPlayableBody")}</p>
        </div>
      </div>
    )
  }

  if (!canStartMission(id, progress.completedMissionIds, progress.completedLessonIds, node)) {
    return (
      <div className="space-y-5 py-16">
        <BackButton to={returnTo} />
        <div className="rounded-3xl border border-border bg-card px-5 py-10 text-center">
          <p className="font-display text-2xl leading-tight">{t("mission.lessonsBeforeStart")}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("mission.finishLessonsToStart")}</p>
          <Link
            to={`/missions/${from ?? id}`}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-6 font-semibold text-white"
          >
            {t("mission.backToPlace")}
          </Link>
        </div>
      </div>
    )
  }

  return <MissionPlayer key={id} experienceId={id} skipIntro returnTo={returnTo} />
}

export function LessonPage() {
  const { id = "" } = useParams()
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { markLessonOpened } = useAppState()
  const from = search.get("from")
  const returnTo = returnPathFromFromParam(from)
  const lesson = getLesson(id)

  useEffect(() => {
    if (lesson && isLessonImplemented(id)) {
      markLessonOpened(id)
    }
  }, [id, lesson, markLessonOpened])
  if (!lesson) {
    return (
      <div className="py-16 text-center">
        <BackButton to={returnTo} />
        <p className="font-display text-2xl">{t("mission.lessonNotFound")}</p>
      </div>
    )
  }
  if (!isLessonImplemented(id) || !lesson.playable) {
    return (
      <div className="space-y-5 py-16">
        <BackButton to={returnTo} />
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
