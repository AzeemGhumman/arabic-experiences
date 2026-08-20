import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/app-shell/AppShell"
import { AppStateProvider } from "@/lib/app-state"
import { I18nProvider } from "@/lib/i18n"
import { MissionNavigationGuardProvider } from "@/lib/mission-navigation-guard"
import { TabNavigationProvider } from "@/lib/tab-navigation"
import { HomePage } from "@/pages/HomePage"
import { CompanionPage } from "@/pages/CompanionPage"
import { JourneySwitchPage } from "@/pages/JourneysPage"
import { UmrahExperiencePage } from "@/pages/UmrahExperiencePage"
import { ProgressPage } from "@/pages/ProgressPage"
import { StudyBookmarksPage } from "@/pages/StudyBookmarksPage"
import { StudyPage } from "@/pages/StudyPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { LessonPage, MissionPlayPage } from "@/pages/MissionPlayPage"
import { MissionPlacePage } from "@/pages/MissionPlacePage"

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <I18nProvider>
          <MissionNavigationGuardProvider>
            <TabNavigationProvider>
              <Routes>
                <Route element={<AppShell />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/companion" element={<CompanionPage />} />
                  <Route path="/companion/umrah/haram" element={<UmrahExperiencePage />} />
                  <Route path="/play/:id" element={<MissionPlayPage />} />
                  <Route path="/missions/:id" element={<MissionPlacePage />} />
                  <Route path="/lessons/:id" element={<LessonPage />} />
                  <Route path="/study" element={<StudyPage />} />
                  <Route path="/study/bookmarks" element={<StudyBookmarksPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/journeys" element={<JourneySwitchPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </TabNavigationProvider>
          </MissionNavigationGuardProvider>
        </I18nProvider>
      </AppStateProvider>
    </BrowserRouter>
  )
}
