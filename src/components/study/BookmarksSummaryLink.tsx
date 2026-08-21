import { Link } from "react-router-dom"
import { Bookmark, ChevronRight } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function BookmarksSummaryLink({ count }: { count: number }) {
  const { t } = useI18n()

  if (count === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-card/50 px-3 py-2.5">
        <p className="text-sm font-semibold text-ink">{t("study.bookmarksTitle")}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{t("study.bookmarksEmpty")}</p>
      </div>
    )
  }

  return (
    <Link
      to="/study/bookmarks"
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl border border-gold/25 bg-gold/[0.06] px-3 py-2.5",
        "transition hover:bg-gold/10",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
        <Bookmark className="size-4 fill-current" strokeWidth={0} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight">{t("study.bookmarksTitle")}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {t("study.bookmarksSummary", { count })}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-ink-soft">
        {count}
        <ChevronRight className="size-4 rtl:rotate-180" />
      </span>
    </Link>
  )
}
