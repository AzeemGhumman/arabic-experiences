import { UmrahJourneyPage } from "@/pages/UmrahJourneyPage"
import { HajjJourneyPage } from "@/pages/HajjJourneyPage"
import { ArabicJourneyPage } from "@/pages/ArabicJourneyPage"
import { QuranJourneyPage } from "@/pages/QuranJourneyPage"
import { useAppState } from "@/lib/app-state"

export function HomePage() {
  const { state } = useAppState()

  if (state.activeJourneyId === "hajj") return <HajjJourneyPage />
  if (state.activeJourneyId === "arabic") return <ArabicJourneyPage />
  if (state.activeJourneyId === "quran") return <QuranJourneyPage />
  return <UmrahJourneyPage />
}
