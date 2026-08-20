import { BookOpen, Compass, Globe2, Headphones, Home, Library, MapPinned, ScrollText, Sparkles, User } from "lucide-react"
import { hasTripCompanion } from "@/data/companion"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { useTabNavigation, type TabId } from "@/lib/tab-navigation"

const tabMeta: { tab: TabId; key: "home" | "study" | "progress" | "trip" | "profile"; icon: typeof Home; tripOnly?: boolean }[] = [
  { tab: "home", key: "home", icon: Home },
  { tab: "study", key: "study", icon: Compass },
  { tab: "progress", key: "progress", icon: BookOpen },
  { tab: "companion", key: "trip", icon: ScrollText, tripOnly: true },
  { tab: "profile", key: "profile", icon: User },
]

const featureMeta = [
  { id: "missions", icon: MapPinned },
  { id: "study", icon: Library },
  { id: "listen", icon: Headphones },
  { id: "progress", icon: Sparkles },
  { id: "journeys", icon: Globe2 },
] as const

export function HomeAbout({ onSelectTab }: { onSelectTab?: (tab: TabId) => void }) {
  const { t } = useI18n()
  const { state } = useAppState()
  const { switchTab } = useTabNavigation()
  const showTrip = hasTripCompanion(state.activeJourneyId)
  const tabs = tabMeta.filter((item) => !item.tripOnly || showTrip)

  function openTab(tab: TabId) {
    onSelectTab?.(tab)
    switchTab(tab)
  }

  return (
    <div className="space-y-5">
      <section>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-terracotta uppercase">
          {t("homeAbout.philosophyKicker")}
        </p>
        <h3 className="font-display mt-1.5 text-xl leading-tight">{t("homeAbout.philosophyTitle")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("homeAbout.philosophyBody")}</p>
      </section>

      <section>
        <h3 className="font-display text-lg">{t("homeAbout.tabsTitle")}</h3>
        <ul className="mt-2 divide-y divide-border rounded-2xl border border-border">
          {tabs.map((item) => (
            <li key={item.tab}>
              <button
                type="button"
                onClick={() => openTab(item.tab)}
                className="flex w-full items-start gap-3 px-3 py-3 text-start transition hover:bg-sky/10"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-ink-soft">
                  <item.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-tight">{t(`nav.${item.key}`)}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                    {t(`homeAbout.tabs.${item.key}`)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-display text-lg">{t("homeAbout.featuresTitle")}</h3>
        <ul className="mt-2 divide-y divide-border rounded-2xl border border-border">
          {featureMeta.map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-3 py-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-ink-soft">
                <item.icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{t(`homeAbout.features.${item.id}.title`)}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  {t(`homeAbout.features.${item.id}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
