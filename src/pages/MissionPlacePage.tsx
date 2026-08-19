import { Link, useNavigate, useParams } from "react-router-dom"
import type { MouseEvent } from "react"
import { Check, Compass } from "lucide-react"
import { ExperienceScene, sceneForExperience } from "@/components/adventure/ExperienceScenes"
import { BackButton } from "@/components/app-shell/BackButton"
import {
  missionAvailability,
  prepAvailability,
} from "@/data/learning/availability"
import { getAdventure } from "@/data/learning/adventures"
import { getPracticesForMission } from "@/data/learning/prep"
import { graphForJourney, isMissionPlayable, stageForNode } from "@/data/learning/mission-graph"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function MissionPlacePage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { state, completeAdventure, setPrepCompleted } = useAppState()
  const { progress } = useActiveJourney()
  const { t, adventure: adventureCopy, stage: stageLabel, mission } = useI18n()
  const graph = graphForJourney(state.activeJourneyId)
  const node = graph?.nodes.find((item) => item.id === id)
  const adventure = getAdventure(id)
  const localized = adventureCopy(id)
  const practices = getPracticesForMission(id)
  const availability = missionAvailability(id, progress.completedAdventureIds, node)
  const unlocked = availability === "open" || availability === "done"
  const completed = availability === "done"
  const playable = isMissionPlayable(id)
  const playHref = availability === "open" && playable ? `/adventures/${id}?from=${id}` : undefined
  const canContinue = Boolean(availability === "open" && adventure && !adventure.playable && !completed)
  const playCount = progress.adventurePlayCounts?.[id] ?? 0
  const stage = graph && node ? stageForNode(graph, node) : undefined
  const title = localized?.title ?? (node ? mission(node.id, node.label) : t("mission.place"))
  const subtitle = localized?.subtitle ?? adventure?.subtitle
  const description = localized?.description ?? adventure?.description
  const status = completed
    ? t("common.done")
    : availability === "locked"
      ? t("common.locked")
      : t("common.open")

  if ((availability === "coming-soon" || availability === "locked") && (node || adventure)) {
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

  if (!node && !adventure) {
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
          {stage ? stageLabel(stage.id, stage.label) : t("mission.place")}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>

      <ExperienceScene scene={sceneForExperience(id)} className="h-40 w-full" />

      {description ? (
        <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      ) : null}

      {(progress.capabilities.navigation ?? 0) >= 2 && adventure?.optionalPools?.length ? (
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
        {adventure?.estimatedMinutes ? (
          <span className="text-ink-soft">
            {adventure.estimatedMinutes} {t("common.min")}
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
              completeAdventure({
                id,
                kind: "adventure",
                vocabularyIds: [],
                rewards: adventure?.capabilityRewards,
                outcome: localized?.canNowDo ?? adventure?.canNowDo ?? "",
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
              {t("prep.forMission")}
            </p>
            <Link to="/prep" className="text-xs font-semibold text-sky-deep">
              {t("prep.viewAll")}
            </Link>
          </div>
          {practices.map((practice) => {
            const done = progress.completedSideMissionIds.includes(practice.id)
            const access = prepAvailability(practice.id)
            const href = access === "open" ? `/side-missions/${practice.id}?from=${id}` : undefined

            function toggleDone(event: MouseEvent) {
              event.preventDefault()
              event.stopPropagation()
              setPrepCompleted(practice.id, !done)
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
                    aria-label={done ? t("prep.markIncomplete") : t("prep.markComplete")}
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
