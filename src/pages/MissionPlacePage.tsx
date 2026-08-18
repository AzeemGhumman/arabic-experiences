import { Link, useNavigate, useParams } from "react-router-dom"
import { Check, Compass } from "lucide-react"
import { ExperienceScene, sceneForExperience } from "@/components/adventure/ExperienceScenes"
import { BackButton } from "@/components/app-shell/BackButton"
import { getAdventure } from "@/data/learning/adventures"
import { getPracticesForMission } from "@/data/learning/prep"
import {
  graphForJourney,
  isMissionPlayable,
  isMissionReleased,
  isNodeUnlocked,
  stageForNode,
} from "@/data/learning/mission-graph"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function MissionPlacePage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { state, completeAdventure } = useAppState()
  const { progress } = useActiveJourney()
  const { t, adventure: adventureCopy, stage: stageLabel, mission } = useI18n()
  const graph = graphForJourney(state.activeJourneyId)
  const node = graph?.nodes.find((item) => item.id === id)
  const adventure = getAdventure(id)
  const localized = adventureCopy(id)
  const practices = getPracticesForMission(id)
  const unlocked = node ? isNodeUnlocked(node, progress.completedAdventureIds) : false
  const completed = progress.completedAdventureIds.includes(id)
  const playable = isMissionPlayable(id)
  const released = isMissionReleased(id)
  const playHref = released && unlocked && playable ? `/adventures/${id}?from=${id}` : undefined
  const canContinue = Boolean(released && adventure && !adventure.playable && unlocked && !completed)
  const playCount = progress.adventurePlayCounts?.[id] ?? 0
  const stage = graph && node ? stageForNode(graph, node) : undefined
  const title = localized?.title ?? (node ? mission(node.id, node.label) : t("mission.place"))
  const subtitle = localized?.subtitle ?? adventure?.subtitle
  const description = localized?.description ?? adventure?.description
  const status = completed ? t("common.done") : unlocked ? t("common.open") : t("common.locked")

  if (!released && (node || adventure)) {
    return (
      <div className="space-y-5 pb-10">
        <BackButton />
        <div className="rounded-3xl border border-border bg-card px-5 py-10 text-center">
          <p className="font-display text-2xl leading-tight">{t("mission.comingSoonTitle")}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("mission.comingSoonBody")}</p>
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
        ) : !unlocked ? (
          <p className="rounded-3xl bg-secondary/80 px-4 py-3 text-sm text-muted-foreground">
            Opens after the previous place.
          </p>
        ) : completed ? (
          <p className="rounded-3xl bg-secondary/80 px-4 py-3 text-sm text-muted-foreground">
            Mission coming soon.
          </p>
        ) : null}
      </div>

      {practices.length > 0 ? (
        <section className="space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-deep uppercase">Practice</p>
          {practices.map((practice) => {
            const done = progress.completedSideMissionIds.includes(practice.id)
            const href =
              practice.playable && isMissionReleased(practice.id)
                ? `/side-missions/${practice.id}?from=${id}`
                : undefined
            return (
              <Link
                key={practice.id}
                to={href ?? "#"}
                aria-disabled={!href}
                className="flex items-center gap-3 rounded-2xl border border-sky/25 bg-sky/10 px-4 py-3"
              >
                <Compass className="size-4 shrink-0 text-sky-deep" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-base leading-tight">{practice.title}</span>
                    {done ? <Check className="size-3.5 text-sage-deep" /> : null}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {done ? t("common.done") : practice.playable ? t("common.open") : "Soon"}
                    {practice.minutes ? ` · ~${practice.minutes} ${t("common.min")}` : ""}
                  </span>
                </span>
              </Link>
            )
          })}
        </section>
      ) : null}
    </div>
  )
}
