import { Link, useNavigate, useParams } from "react-router-dom"
import { ExperienceScene, sceneForExperience } from "@/components/mission/ExperienceScenes"
import { MissionPrerequisiteList } from "@/components/mission/MissionPrerequisiteList"
import { HoverTooltip } from "@/components/ui/hover-tooltip"
import { BackButton } from "@/components/app-shell/BackButton"
import { canStartMission, missionAvailability } from "@/data/learning/availability"
import {
  getMissionPrerequisiteLessons,
  missionPrerequisiteProgress,
} from "@/data/learning/mission-prerequisites"
import { getMission } from "@/data/learning/missions"
import { graphForJourney, isMissionPlayable } from "@/data/learning/mission-graph"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function MissionPlacePage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { state, completeMission } = useAppState()
  const { progress } = useActiveJourney()
  const { t, missionDetail, mission } = useI18n()
  const graph = graphForJourney(state.activeJourneyId)
  const node = graph?.nodes.find((item) => item.id === id)
  const content = getMission(id)
  const localized = missionDetail(id)
  const prerequisites = getMissionPrerequisiteLessons(id)
  const prerequisiteProgress = missionPrerequisiteProgress(id, progress.completedLessonIds)
  const availability = missionAvailability(id, progress.completedMissionIds, node)
  const completed = availability === "done"
  const playable = isMissionPlayable(id)
  const readyToStart = canStartMission(id, progress.completedMissionIds, progress.completedLessonIds, node)
  const playHref = readyToStart && playable ? `/play/${id}?from=${id}` : undefined
  const canContinue = Boolean(availability === "open" && content && !content.playable && !completed)
  const title = localized?.title ?? (node ? mission(node.id, node.label) : t("mission.place"))
  const subtitle = localized?.subtitle ?? content?.subtitle
  const description = localized?.description ?? content?.description
  const showLessonProgress = prerequisites.length > 0 && !completed
  const startLabel = completed ? t("mission.replayMission") : t("mission.startMission")
  const showStartMission = (availability === "open" || availability === "done") && playable
  const lockedStartTooltipLines =
    showLessonProgress && !readyToStart
      ? [
          t("mission.startMissionLockedTooltipLead"),
          t("mission.lessonsProgress", {
            done: prerequisiteProgress.done,
            total: prerequisiteProgress.total,
          }),
        ]
      : undefined

  if ((availability === "coming-soon" || availability === "locked") && (node || content)) {
    return (
      <div className="space-y-5 pb-10">
        <BackButton />
        <div className="rounded-3xl border border-border bg-card px-5 py-10 text-center">
          <p className="font-display text-2xl leading-tight">
            {availability === "locked" ? t("common.locked") : t("mission.comingSoonTitle")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {availability === "locked" ? t("mission.lockedBody") : t("mission.comingSoonBody")}
          </p>
        </div>
      </div>
    )
  }

  if (!node && !content) {
    return (
      <div className="py-16">
        <BackButton />
        <p className="font-display text-2xl">{t("mission.placeNotFound")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-10">
      <header>
        <BackButton />
        <h1 className="font-display text-3xl leading-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>

      <ExperienceScene scene={sceneForExperience(id)} missionId={id} className="h-40 w-full" />

      {description ? (
        <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      ) : null}

      {(progress.capabilities.navigation ?? 0) >= 2 && content?.optionalPools?.length ? (
        <p className="text-sm text-sage-deep">{t("mission.richerVocab")}</p>
      ) : null}

      {showStartMission ? (
        <div className="space-y-2">
          {playHref ? (
            <Link
              to={playHref}
              className="flex min-h-12 items-center justify-center rounded-full bg-terracotta font-semibold text-white"
            >
              {startLabel}
            </Link>
          ) : lockedStartTooltipLines ? (
            <HoverTooltip lines={lockedStartTooltipLines} className="cursor-not-allowed">
              <button
                type="button"
                disabled
                aria-disabled
                className={cn(
                  "pointer-events-none flex min-h-12 w-full items-center justify-center rounded-full",
                  "bg-terracotta/35 font-semibold text-white/90",
                )}
              >
                {startLabel}
              </button>
            </HoverTooltip>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled
              className={cn(
                "flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full",
                "bg-terracotta/35 font-semibold text-white/90",
              )}
            >
              {startLabel}
            </button>
          )}
          {showLessonProgress ? (
            <p className="text-center text-sm text-muted-foreground">
              {t("mission.lessonsProgress", {
                done: prerequisiteProgress.done,
                total: prerequisiteProgress.total,
              })}
            </p>
          ) : null}
        </div>
      ) : canContinue ? (
        <button
          type="button"
          className="flex min-h-12 w-full items-center justify-center rounded-full bg-terracotta font-semibold text-white"
          onClick={() => {
            completeMission({
              id,
              kind: "mission",
              vocabularyIds: [],
              rewards: content?.capabilityRewards,
              outcome: localized?.canNowDo ?? content?.canNowDo ?? "",
            })
            navigate("/")
          }}
        >
          {t("progress.continueJourney")}
        </button>
      ) : availability === "locked" ? (
        <p className="rounded-3xl bg-secondary/80 px-4 py-3 text-sm text-muted-foreground">
          {t("mission.lockedBody")}
        </p>
      ) : null}

      <MissionPrerequisiteList
        missionId={id}
        lessons={prerequisites}
        completedLessonIds={progress.completedLessonIds}
      />
    </div>
  )
}
