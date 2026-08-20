import { ArrowLeft } from "lucide-react"
import { useTabNavigation } from "@/lib/tab-navigation"

export function BackButton({ to }: { to?: string }) {
  const { goBack } = useTabNavigation()

  return (
    <button
      type="button"
      onClick={() => goBack(to)}
      className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-paper px-4 text-sm font-semibold text-ink shadow-sm"
      aria-label="Back"
    >
      <ArrowLeft className="size-5 rtl:rotate-180" />
      Back
    </button>
  )
}
