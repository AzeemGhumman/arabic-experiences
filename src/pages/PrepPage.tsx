import { buildPrepCatalog } from "@/data/learning/prep-catalog"
import { BookmarksSummaryLink } from "@/components/prep/BookmarksSummaryLink"
import { PrepTopicSection } from "@/components/prep/PrepTopicSection"
import { useActiveJourney } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function PrepPage() {
  const { progress } = useActiveJourney()
  const { t } = useI18n()
  const catalog = buildPrepCatalog(progress.completedSideMissionIds)
  const doneTotal = catalog.reduce((sum, group) => sum + group.doneCount, 0)
  const implementedTotal = catalog.reduce((sum, group) => sum + group.implementedCount, 0)

  return (
    <div className="space-y-4 pb-8">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-deep uppercase">{t("prep.kicker")}</p>
          <h1 className="font-display mt-1 text-2xl leading-tight">{t("prep.title")}</h1>
        </div>
        {implementedTotal > 0 ? (
          <span className="shrink-0 pb-0.5 text-xs font-semibold text-ink-soft">
            {doneTotal}/{implementedTotal}
          </span>
        ) : null}
      </header>

      <BookmarksSummaryLink count={progress.bookmarkedVocab.length} />

      <div className="space-y-3">
        {catalog.map((group) => (
          <PrepTopicSection key={group.topic.id} group={group} />
        ))}
      </div>
    </div>
  )
}
