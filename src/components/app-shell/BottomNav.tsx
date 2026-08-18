import { BookOpen, Home, ScrollText, User } from "lucide-react"
import { useLocation } from "react-router-dom"
import { hasTripCompanion } from "@/data/companion"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { isTabActive, type TabId, useTabNavigation } from "@/lib/tab-navigation"
import { cn } from "@/lib/utils"

const tabs: { tab: TabId; key: "home" | "progress" | "trip" | "profile"; icon: typeof Home; tripOnly?: boolean }[] = [
  { tab: "home", key: "home", icon: Home },
  { tab: "progress", key: "progress", icon: BookOpen },
  { tab: "companion", key: "trip", icon: ScrollText, tripOnly: true },
  { tab: "profile", key: "profile", icon: User },
]

export function BottomNav() {
  const { state } = useAppState()
  const { t } = useI18n()
  const { pathname } = useLocation()
  const { switchTab } = useTabNavigation()
  const showTrip = hasTripCompanion(state.activeJourneyId)
  const visible = tabs.filter((item) => !item.tripOnly || showTrip)

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-30 border-t border-border/80 bg-paper/90 px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-md items-center justify-between">
        {visible.map((item) => {
          const active = isTabActive(item.tab, pathname)
          return (
            <li key={item.tab} className="flex-1">
              <button
                type="button"
                onClick={() => switchTab(item.tab)}
                className={cn(
                  "flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-semibold transition",
                  active ? "text-terracotta" : "text-ink-soft hover:text-ink",
                )}
              >
                <item.icon className="size-5" />
                {t(`nav.${item.key}`)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
