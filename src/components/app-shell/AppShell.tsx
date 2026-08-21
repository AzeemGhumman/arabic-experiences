import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { BottomNav } from "@/components/app-shell/BottomNav"
import { JourneyTracker } from "@/components/app-shell/JourneyTracker"
import { Onboarding } from "@/components/app-shell/Onboarding"
import { useAppState } from "@/lib/app-state"
import { applyLocaleToDocument, isRtlLanguage, resetLocaleDocument } from "@/lib/locale"

export function AppShell() {
  const { state } = useAppState()
  const location = useLocation()
  const rtl = isRtlLanguage(state.language)
  const onCompanion = location.pathname.startsWith("/companion")

  useEffect(() => {
    applyLocaleToDocument(state.language)
    return () => {
      resetLocaleDocument()
    }
  }, [state.language])

  return (
    <div className="min-h-dvh" dir={rtl ? "rtl" : "ltr"}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-cream/40 shadow-[0_0_80px_-20px_rgba(58,47,38,0.25)] lg:max-w-[480px]">
        {state.onboardingComplete && !onCompanion ? <JourneyTracker /> : null}
        <main className="flex-1 px-4 pt-6 pb-4 sm:px-5">
          <Outlet />
        </main>
        <BottomNav />
      </div>
      <Onboarding />
    </div>
  )
}
