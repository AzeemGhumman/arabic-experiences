import { buildStudyCatalog } from "@/data/learning/study-catalog"
import { BookmarksSummaryLink } from "@/components/study/BookmarksSummaryLink"
import { TopicList } from "@/components/study/TopicList"
import { useActiveJourney } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function StudyPage() {
  const { progress } = useActiveJourney()
  const { t } = useI18n()
  const catalog = buildStudyCatalog(progress.completedLessonIds)

  return (
    <div className="space-y-4 pb-8">
      <header>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-sky-deep uppercase">{t("study.kicker")}</p>
        <h1 className="font-display mt-1 text-2xl leading-tight">{t("study.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("study.body")}</p>
      </header>

      <BookmarksSummaryLink count={progress.bookmarkedVocab.length} />

      <TopicList catalog={catalog} />
    </div>
  )
}
