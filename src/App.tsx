import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/app-shell/AppShell"
import { AppStateProvider } from "@/lib/app-state"
import { I18nProvider } from "@/lib/i18n"
import { TabNavigationProvider } from "@/lib/tab-navigation"
import { HomePage } from "@/pages/HomePage"
import { CompanionPage } from "@/pages/CompanionPage"
import { JourneySwitchPage } from "@/pages/JourneysPage"
import { UmrahExperiencePage } from "@/pages/UmrahExperiencePage"
import { RestaurantScenarioPage } from "@/pages/RestaurantScenarioPage"
import { GardenScenarioPage } from "@/pages/GardenScenarioPage"
import { VocabularyDetailPage } from "@/pages/VocabularyDetailPage"
import { ProgressPage } from "@/pages/ProgressPage"
import { PrepPage } from "@/pages/PrepPage"
import { PrepBookmarksPage } from "@/pages/PrepBookmarksPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { AdventurePage, SideMissionPage } from "@/pages/AdventurePage"
import { MissionPlacePage } from "@/pages/MissionPlacePage"

export default function App() {
  return (
    <BrowserRouter>
      <TabNavigationProvider>
        <AppStateProvider>
          <I18nProvider>
          <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/companion" element={<CompanionPage />} />
            <Route path="/companion/umrah/haram" element={<UmrahExperiencePage />} />
            <Route path="/journeys" element={<Navigate to="/profile/journeys" replace />} />
            <Route path="/journeys/umrah" element={<Navigate to="/" replace />} />
            <Route path="/journeys/umrah/haram" element={<Navigate to="/companion/umrah/haram" replace />} />
            <Route path="/journeys/hajj" element={<Navigate to="/" replace />} />
            <Route path="/journeys/arabic" element={<Navigate to="/" replace />} />
            <Route path="/journeys/arabic/restaurant" element={<RestaurantScenarioPage />} />
            <Route path="/adventures/:id" element={<AdventurePage />} />
            <Route path="/missions/:id" element={<MissionPlacePage />} />
            <Route path="/side-missions/:id" element={<SideMissionPage />} />
            <Route path="/journeys/quran" element={<Navigate to="/" replace />} />
            <Route path="/journeys/quran/garden" element={<GardenScenarioPage />} />
            <Route path="/vocabulary/:id" element={<VocabularyDetailPage />} />
            <Route path="/learn" element={<Navigate to="/progress" replace />} />
            <Route path="/prep" element={<PrepPage />} />
            <Route path="/prep/bookmarks" element={<PrepBookmarksPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/journeys" element={<JourneySwitchPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          </Routes>
          </I18nProvider>
        </AppStateProvider>
      </TabNavigationProvider>
    </BrowserRouter>
  )
}
