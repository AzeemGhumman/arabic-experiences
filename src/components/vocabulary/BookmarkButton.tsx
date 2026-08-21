import { Bookmark } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function BookmarkButton({
  bookmarked,
  onToggle,
  className,
}: {
  bookmarked: boolean
  onToggle: () => void
  className?: string
}) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      aria-pressed={bookmarked}
      aria-label={bookmarked ? t("common.removeBookmark") : t("common.bookmark")}
      onClick={(event) => {
        event.stopPropagation()
        onToggle()
      }}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full transition",
        bookmarked
          ? "bg-gold/20 text-gold"
          : "text-muted-foreground hover:bg-secondary hover:text-ink-soft",
        className,
      )}
    >
      <Bookmark className={cn("size-4", bookmarked && "fill-current")} strokeWidth={bookmarked ? 0 : 2} />
    </button>
  )
}
