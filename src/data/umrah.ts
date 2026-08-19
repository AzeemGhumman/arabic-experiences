import type { UmrahStep } from "@/lib/storage"

export const umrahSteps: UmrahStep[] = [
  {
    id: "prepare",
    title: "Prepare",
    subtitle: "Intention, packing, and the days before you leave",
    status: "not-started",
  },
  {
    id: "ihram",
    title: "Ihram",
    subtitle: "Entering a state of simplicity and focus",
    status: "not-started",
  },
  {
    id: "travel",
    title: "Travel",
    subtitle: "Airport, arrival, and the road toward Makkah",
    status: "not-started",
  },
  {
    id: "arrive",
    title: "Arrive in Makkah",
    subtitle: "First sights, hotel, and settling in",
    status: "not-started",
  },
  {
    id: "haram",
    title: "Enter the Haram",
    subtitle: "Walking toward Masjid al-Haram",
    status: "not-started",
    href: "/companion/umrah/haram",
  },
  {
    id: "tawaf",
    title: "Tawaf",
    subtitle: "Circling the Kaaba with presence",
    status: "not-started",
  },
  {
    id: "sai",
    title: "Sa'i",
    subtitle: "Between Safa and Marwah",
    status: "not-started",
  },
  {
    id: "complete",
    title: "Complete Umrah",
    subtitle: "Closing the journey with gratitude",
    status: "not-started",
  },
]

export const haramExperience = {
  id: "haram",
  title: "Entering Masjid al-Haram",
  kicker: "Guide",
  atmosphere: "Dusk light on white marble. The courtyard opens slowly, then all at once.",
  context:
    "You have arrived at one of the most visited places on earth. This moment is less about rushing to the next rite and more about arriving with your attention. Notice the scale, the sound, and the way people move toward the center.",
  historicalNote:
    "Placeholder historical note: Masjid al-Haram has been expanded across many centuries. Exact dates, names, and rulings will be curated with qualified scholars before production.",
  notice: [
    "The first glimpse of the Kaaba often arrives later than you expect. Give yourself time.",
    "Marble can be cool underfoot. The space is large; orientation takes a moment.",
    "People enter from many directions. Follow the flow rather than forcing a path.",
    "This is a place of worship and gathering. Keep your phone use quiet and brief.",
  ],
  supplication: {
    title: "A moment of arrival",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahumma iftah li abwaba rahmatik",
    translation: "O Allah, open for me the doors of Your mercy.",
    note: "Placeholder wording for prototype exploration only. Verify authentic wording and context with qualified scholars before production use.",
  },
  disclaimer:
    "Prototype content only. Religious guidance should be reviewed by qualified scholars before production use.",
}

export const hajjMoments = [
  {
    id: "ihram",
    title: "Ihram",
    description: "Enter the sacred state before the days begin.",
    status: "coming-soon" as const,
  },
  {
    id: "mina",
    title: "Mina",
    description: "The tent city and the rhythm of the days of Hajj.",
    status: "coming-soon" as const,
  },
  {
    id: "arafat",
    title: "Arafat",
    description: "The standing. The heart of the pilgrimage.",
    status: "coming-soon" as const,
  },
  {
    id: "muzdalifah",
    title: "Muzdalifah",
    description: "Night under the open sky, gathering stones.",
    status: "coming-soon" as const,
  },
  {
    id: "jamarat",
    title: "Jamarat",
    description: "The stoning ritual, walked with care and clarity.",
    status: "coming-soon" as const,
  },
  {
    id: "tawaf",
    title: "Tawaf",
    description: "Return to the Kaaba after the days outside Makkah.",
    status: "coming-soon" as const,
  },
  {
    id: "sacrifice",
    title: "Sacrifice",
    description: "A placeholder for the rite of Qurbani / Hady.",
    status: "coming-soon" as const,
  },
  {
    id: "return",
    title: "Returning to Makkah",
    description: "Closing the days and finding your way back.",
    status: "coming-soon" as const,
  },
]
