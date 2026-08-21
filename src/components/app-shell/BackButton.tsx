import { ArrowLeft } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useTabNavigation } from "@/lib/tab-navigation"

export function BackButton({ to }: { to?: string }) {
  const { goBack } = useTabNavigation()
  const { t } = useI18n()

  return (
    <button
      type="button"
      onClick={() => goBack(to)}
      className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-paper px-4 text-sm font-semibold text-ink shadow-sm"
      aria-label={t("common.back")}
    >
      <ArrowLeft className="size-5 rtl:rotate-180" />
      {t("common.back")}
    </button>
  )
}
