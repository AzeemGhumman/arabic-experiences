import { buildPrepCatalog } from "@/data/learning/prep-catalog"
import { BookmarksSummaryLink } from "@/components/prep/BookmarksSummaryLink"
import { PrepTopicList } from "@/components/prep/PrepTopicSection"
import { useActiveJourney } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function PrepPage() {
  const { progress } = useActiveJourney()
  const { t } = useI18n()
  const catalog = buildPrepCatalog(progress.completedSideMissionIds)

  return (
    <div className="space-y-4 pb-8">
      <header>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-deep uppercase">{t("prep.kicker")}</p>
        <h1 className="font-display mt-1 text-2xl leading-tight">{t("prep.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("prep.body")}</p>
      </header>

      <BookmarksSummaryLink count={progress.bookmarkedVocab.length} />

      <PrepTopicList catalog={catalog} />
    </div>
  )
}
