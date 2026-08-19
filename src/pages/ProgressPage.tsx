import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import { ProgressRing } from "@/components/progress/ProgressRing"
import { BookmarksSummaryLink } from "@/components/prep/BookmarksSummaryLink"
import { capabilities } from "@/data/learning/capabilities"
import { adventures } from "@/data/learning/adventures"
import { getVocabByIds } from "@/data/vocabulary"
import { getLearningWord } from "@/data/learning/words"
import { graphForJourney, nextPlayableAdventure } from "@/data/learning/mission-graph"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function ProgressPage() {
  const { state } = useAppState()
  const { journey, progress, stats } = useActiveJourney()
  const { t, journey: journeyCopy, adventure: adventureCopy, capability: capabilityCopy, depthLabel, word } =
    useI18n()
  const journeyStrings = journeyCopy(journey.category)

  const sceneWords = getVocabByIds(progress.discoveredVocab)
  const adventureWords = progress.discoveredVocab
    .map((id) => getLearningWord(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item) => !sceneWords.some((scene) => scene.id === item.id))
  const groupedScene = sceneWords.reduce<Record<string, typeof sceneWords>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? []
    acc[item.category].push(item)
    return acc
  }, {})
  const groupedAdventure = adventureWords.reduce<Record<string, typeof adventureWords>>((acc, item) => {
    const key = item.domains[0] ?? "journey"
    acc[key] = acc[key] ?? []
    acc[key].push(item)
    return acc
  }, {})
  const wordCount = sceneWords.length + adventureWords.length
  const bookmarkCount = progress.bookmarkedVocab.length

  const canDo = [
    ...adventures
      .filter((item) => progress.completedAdventureIds.includes(item.id))
      .map((item) => adventureCopy(item.id)?.canNowDo ?? item.canNowDo),
    state.activeJourneyId === "arabic" &&
    state.restaurantAsked.includes("water") &&
    state.restaurantAsked.includes("rice")
      ? "Order from a restaurant table by tapping what you see"
      : null,
    state.activeJourneyId === "quran" && state.gardenCelebrated
      ? "Recognize a handful of Quranic garden words"
      : null,
  ].filter((item): item is string => Boolean(item))

  const startedSkills = capabilities.filter((item) => (progress.capabilities[item.id] ?? 0) > 0)
  const graph = graphForJourney(state.activeJourneyId)
  const nextId = graph
    ? nextPlayableAdventure([...progress.completedAdventureIds, ...progress.completedSideMissionIds], graph)
    : undefined
  const empty = canDo.length === 0 && wordCount === 0 && bookmarkCount === 0

  return (
    <div className="space-y-6 pb-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-ink-soft uppercase">{t("progress.kicker")}</p>
          <h1 className="font-display mt-2 text-3xl leading-tight">
            {t("progress.titleOn", { journey: journeyStrings.title })}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("progress.body")}</p>
        </div>
        <ProgressRing value={Math.min(100, stats.percent)} size={72} />
      </header>

      <p className="text-sm text-ink-soft">
        {t("progress.statsLine", {
          done: stats.done,
          total: stats.total,
          count: wordCount,
          wordLabel: wordCount === 1 ? t("common.word") : t("common.words"),
        })}
      </p>

      {empty ? (
        <div className="rounded-3xl border border-dashed border-border bg-paper px-5 py-10 text-center">
          <p className="font-display text-xl">{t("progress.emptyTitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("progress.emptyBody")}</p>
          <Link
            to={nextId ? `/adventures/${nextId}` : "/"}
            className="mt-4 inline-block text-sm font-semibold text-terracotta"
          >
            {t("progress.continueJourney")}
          </Link>
        </div>
      ) : (
        <>
          <section className="rounded-[1.75rem] border border-sage/30 bg-sage/10 p-5">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-sage-deep uppercase">
              {t("progress.canNow")}
            </p>
            {canDo.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed">{t("progress.canNowEmpty")}</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {canDo.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-sage" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {startedSkills.length > 0 ? (
            <section>
              <h2 className="font-display text-xl">{t("progress.skillsTitle")}</h2>
              <div className="mt-3 space-y-2">
                {startedSkills.map((item) => {
                  const level = progress.capabilities[item.id] ?? 0
                  const localized = capabilityCopy(item.id)
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
                    >
                      <div>
                        <p className="font-medium">{localized?.title ?? item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {(localized?.depths ?? item.depths)[Math.min(level, 3) - 1]}
                        </p>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                        {depthLabel(level)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null}

          <section className="space-y-2">
            <h2 className="font-display text-xl">{t("progress.bookmarksTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("progress.bookmarksBody")}</p>
            <BookmarksSummaryLink count={bookmarkCount} />
          </section>

          <section className="space-y-5">
            <div>
              <h2 className="font-display text-xl">{t("progress.wordsTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("progress.wordsBody")}</p>
            </div>
            {wordCount === 0 ? (
              <p className="text-sm text-muted-foreground">{t("progress.wordsEmpty")}</p>
            ) : (
              <>
                {Object.entries(groupedAdventure).map(([category, words]) => (
                  <WordGroup key={category} title={category}>
                    {words.map((item) => (
                      <article key={item.id} className="rounded-3xl border border-border bg-card p-4">
                        <p className="arabic-text text-2xl">{item.arabic}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{word(item.id, item.meaning)}</p>
                      </article>
                    ))}
                  </WordGroup>
                ))}
                {Object.entries(groupedScene).map(([category, words]) => (
                  <WordGroup key={category} title={category}>
                    {words.map((item) => (
                      <Link
                        key={item.id}
                        to={`/vocabulary/${item.id}`}
                        className="rounded-3xl border border-border bg-card p-4"
                      >
                        <p className="arabic-text text-2xl">{item.arabic}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{word(item.id, item.meaning)}</p>
                      </Link>
                    ))}
                  </WordGroup>
                ))}
              </>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function WordGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg capitalize">{title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}
