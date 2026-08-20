import type { StudyResource } from "@/lib/learning-types"

/**
 * MOCK DATA — placeholder links and videos for UI review.
 * Replace with vetted, mission-specific resources before launch.
 */
const resources: Record<string, StudyResource[]> = {
  "numbers-everywhere": [
    {
      title: "Arabic numbers 0–20 (practice video)",
      url: "https://www.youtube.com/watch?v=2iwcaVUAK_4",
      kind: "youtube",
      source: "LearnArabicNow · YouTube",
      note: "Counts 1–20 in standard Arabic with transliteration.",
      youtubeVideoId: "2iwcaVUAK_4",
    },
    {
      title: "Madinah Arabic Book 1 (PDF)",
      url: "https://archive.org/download/ArabicLanguageCourseBooks/Madina_Book1_Arabic_Text.pdf",
      kind: "pdf",
      source: "Dr. V. Abdur-Rahim · Islamic University of Madinah",
      note: "Lessons 19–20 cover numbers 1–10 and counting rules.",
    },
    {
      title: "Lesson 19 — Numbers 1–10",
      url: "https://www.madinaharabic.com/arabic-language-course/lessons/L019_001.html",
      kind: "website",
      source: "MadinahArabic.com",
      note: "Interactive lesson with examples and drills.",
    },
  ],
  "master-navigation": [
    {
      title: "Madinah Arabic Book 1 — video course",
      url: "https://www.youtube.com/playlist?list=PL2C51DED07020185B",
      kind: "youtube",
      source: "Madinah Arabic Course · YouTube",
      note: "Full book walkthrough; see lessons 5–6 for directions.",
      youtubePlaylistId: "PL2C51DED07020185B",
    },
    {
      title: "Madinah Arabic Book 1 (PDF)",
      url: "https://archive.org/download/ArabicLanguageCourseBooks/Madina_Book1_Arabic_Text.pdf",
      kind: "pdf",
      source: "Dr. V. Abdur-Rahim · Islamic University of Madinah",
      note: "Lessons 5–6 introduce prepositions and direction phrases.",
    },
    {
      title: "Lesson 5 — Prepositions",
      url: "https://www.madinaharabic.com/arabic-language-course/lessons/L005_001.html",
      kind: "website",
      source: "MadinahArabic.com",
      note: "In, on, from, to — the building blocks of giving directions.",
    },
  ],
  "explore-food": [
    {
      title: "Ordering food in Arabic (practice video)",
      url: "https://www.youtube.com/watch?v=GOGy0cWzOdk",
      kind: "youtube",
      source: "Maha · YouTube",
      note: "Common restaurant phrases in everyday Arabic.",
      youtubeVideoId: "GOGy0cWzOdk",
    },
    {
      title: "Madinah Arabic Reader Book 1 (PDF)",
      url: "https://archive.org/download/DrV.AbdurRahim.MadinahArabicReader/Dr%20V.%20Abdur%20Rahim.%20Madinah%20Arabic%20Reader%20-%201%20(2013).pdf",
      kind: "pdf",
      source: "Dr. V. Abdur-Rahim · Islamic University of Madinah",
      note: "Graded conversations include ordering and everyday food words.",
    },
    {
      title: "Arabic phrasebook — eating",
      url: "https://en.wikivoyage.org/wiki/Arabic_phrasebook#Eating",
      kind: "website",
      source: "Wikivoyage (Creative Commons)",
      note: "Public phrase list for restaurant situations.",
    },
  ],
}

export function getStudyResources(lessonId: string): StudyResource[] {
  return resources[lessonId] ?? []
}

export const studyResourcesAreMock = true
