import { Link, useNavigate, useParams } from "react-router-dom"
import type { MouseEvent } from "react"
import { Check, Compass } from "lucide-react"
import { ExperienceScene, sceneForExperience } from "@/components/mission/ExperienceScenes"
import { BackButton } from "@/components/app-shell/BackButton"
import {
  missionAvailability,
  lessonAvailability,
} from "@/data/learning/availability"
import { getMission } from "@/data/learning/missions"
import { getPracticesForMission } from "@/data/learning/study-catalog"
import { graphForJourney, isMissionPlayable, chapterForNode } from "@/data/learning/mission-graph"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function MissionPlacePage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { state, completeMission, setLessonCompleted } = useAppState()
  const { progress } = useActiveJourney()
  const { t, missionDetail, chapter: chapterLabel, mission } = useI18n()
  const graph = graphForJourney(state.activeJourneyId)
  const node = graph?.nodes.find((item) => item.id === id)
  const content = getMission(id)
  const localized = missionDetail(id)
  const practices = getPracticesForMission(id)
  const availability = missionAvailability(id, progress.completedMissionIds, node)
  const unlocked = availability === "open" || availability === "done"
  const completed = availability === "done"
  const playable = isMissionPlayable(id)
  const playHref = availability === "open" && playable ? `/play/${id}?from=${id}` : undefined
  const canContinue = Boolean(availability === "open" && content && !content.playable && !completed)
  const playCount = progress.missionPlayCounts?.[id] ?? 0
  const stage = graph && node ? chapterForNode(graph, node) : undefined
  const title = localized?.title ?? (node ? mission(node.id, node.label) : t("mission.place"))
  const subtitle = localized?.subtitle ?? content?.subtitle
  const description = localized?.description ?? content?.description
  const status = completed
    ? t("common.done")
    : availability === "locked"
      ? t("common.locked")
      : t("common.open")

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
        <p className="text-[11px] font-semibold tracking-[0.2em] text-terracotta uppercase">
          {stage ? chapterLabel(stage.id, stage.label) : t("mission.place")}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{title}</h1>
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

      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span
          className={
            completed
              ? "rounded-full bg-sage/15 px-2.5 py-1 text-sage-deep"
              : unlocked
                ? "rounded-full bg-terracotta/15 px-2.5 py-1 text-terracotta"
                : "rounded-full bg-secondary px-2.5 py-1 text-muted-foreground"
          }
        >
          {completed ? (
            <span className="inline-flex items-center gap-1">
              <Check className="size-3" /> {t("common.done")}
            </span>
          ) : (
            status
          )}
        </span>
        {content?.estimatedMinutes ? (
          <span className="text-ink-soft">
            {content.estimatedMinutes} {t("common.min")}
          </span>
        ) : null}
        {playCount > 1 ? (
          <span className="text-ink-soft/60">
            {t("mission.played")} {playCount}×
          </span>
        ) : null}
      </div>

      <div className="space-y-2">
        {playHref ? (
          <Link
            to={playHref}
            className="flex min-h-12 items-center justify-center rounded-full bg-terracotta font-semibold text-white"
          >
            {completed ? t("common.playAgain") : t("mission.startMission")}
          </Link>
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
      </div>

      {practices.length > 0 ? (
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-deep uppercase">
              {t("study.forMission")}
            </p>
            <Link to="/study" className="text-xs font-semibold text-sky-deep">
              {t("study.viewAll")}
            </Link>
          </div>
          {practices.map((practice) => {
            const done = progress.completedLessonIds.includes(practice.id)
            const access = lessonAvailability(practice.id)
            const href = access === "open" ? `/lessons/${practice.id}?from=${id}` : undefined

            function toggleDone(event: MouseEvent) {
              event.preventDefault()
              event.stopPropagation()
              setLessonCompleted(practice.id, !done)
            }

            const card = (
              <>
                <Compass className="size-4 shrink-0 text-sky-deep" />
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-base leading-tight">{practice.title}</span>
                  {practice.minutes ? (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {practice.minutes} {t("common.min")}
                    </span>
                  ) : null}
                </span>
                {access === "open" ? (
                  <button
                    type="button"
                    aria-label={done ? t("study.markIncomplete") : t("study.markComplete")}
                    aria-pressed={done}
                    onClick={toggleDone}
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      done
                        ? "border-sage bg-sage text-white"
                        : "border-border/80 bg-paper text-transparent hover:border-sage/40"
                    }`}
                  >
                    <Check className={`size-4 stroke-[3] ${done ? "opacity-100" : "opacity-0"}`} />
                  </button>
                ) : null}
              </>
            )

            if (!href) {
              return (
                <div
                  key={practice.id}
                  className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-4 py-3 opacity-80"
                >
                  {card}
                </div>
              )
            }

            return (
              <Link
                key={practice.id}
                to={href}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  done
                    ? "border-sage/35 bg-sage/12 hover:bg-sage/18"
                    : "border-sky/25 bg-sky/10 hover:bg-sky/15"
                }`}
              >
                {card}
              </Link>
            )
          })}
        </section>
      ) : null}
    </div>
  )
}
