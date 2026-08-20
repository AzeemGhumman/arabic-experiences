import type { JourneyCategory } from "@/lib/storage"

/** Localized mission place-page copy. */
export type MissionStrings = {
  title: string
  subtitle: string
  description: string
  canNowDo: string
}

/** Journey metadata shown in onboarding, profile, and headers. */
export type JourneyStrings = {
  title: string
  description: string
  onboardingLabel: string
  onboardingHint: string
}

/** Capability skill block. */
export type CapabilityStrings = {
  title: string
  depths: [string, string, string]
}

/**
 * Full language pack. Duplicate this shape for each locale file — TypeScript
 * will flag any missing keys when a new locale is added.
 */
export type LanguagePack = {
  meta: {
    code: string
    name: string
    nativeName: string
  }
  ui: {
    nav: {
      home: string
      study: string
      progress: string
      trip: string
      profile: string
    }
    common: {
      active: string
      back: string
      continue: string
      enter: string
      done: string
      open: string
      locked: string
      ahead: string
      here: string
      min: string
      word: string
      words: string
      of: string
      missions: string
      keepData: string
      deleteEverything: string
      stayHere: string
      switchJourney: string
      playAgain: string
      backToMap: string
      percentComplete: string
    }
    study: {
      kicker: string
      title: string
      body: string
      lessonsDone: string
      footer: string
      stage: string
      forMission: string
      viewAll: string
      markComplete: string
      markIncomplete: string
      bookmarksTitle: string
      bookmarksEmpty: string
      bookmarksSummary: string
      bookmarksPageTitle: string
      bookmarksPageBody: string
      saveBookmarks: string
      shelves: Record<string, { title: string; body: string }>
      topics: Record<string, { title: string; body: string }>
    }
    onboarding: {
      title: string
      subtitle: string
      body: string
      cta: string
    }
    homeAbout: {
      openHelp: string
      about: string
      dialogTitle: string
      philosophyKicker: string
      philosophyTitle: string
      philosophyBody: string
      tabsTitle: string
      tabs: {
        home: string
        study: string
        progress: string
        trip: string
        profile: string
      }
      featuresTitle: string
      features: {
        missions: { title: string; body: string }
        study: { title: string; body: string }
        listen: { title: string; body: string }
        progress: { title: string; body: string }
        journeys: { title: string; body: string }
      }
    }
    profile: {
      kicker: string
      title: string
      activeJourney: string
      activeJourneyBody: string
      switchJourney: string
      interfaceLanguage: string
      interfaceLanguageBody: string
      showTransliteration: string
      showTransliterationHint: string
      showTranslation: string
      showTranslationHint: string
      yourData: string
      yourDataBody: string
      deleteData: string
      deleteTitle: string
      deleteBody: string
    }
    progress: {
      kicker: string
      titleOn: string
      body: string
      statsLine: string
      emptyTitle: string
      emptyBody: string
      continueJourney: string
      canNow: string
      canNowEmpty: string
      skillsTitle: string
      wordsTitle: string
      wordsBody: string
      wordsEmpty: string
      bookmarksTitle: string
      bookmarksBody: string
      bookmarksEmpty: string
    }
    journeys: {
      switchKicker: string
      switchTitle: string
      youAreOn: string
      youAreOnBody: string
      switchToOther: string
      switchToOtherBody: string
      switchConfirmTitle: string
      switchConfirmBody: string
      comingSoonBody: string
      cardCurrent: string
      cardJourney: string
      onThisJourney: string
      progressInJourney: string
      statusStart: string
      statusInProgress: string
      statusCompleted: string
      statusComingSoon: string
    }
    map: {
      yourJourney: string
      youreIn: string
      lede: string
      howTitle: string
      howMission: string
      howStudy: string
      howTrip: string
      howDismiss: string
      howStart: string
    }
    mission: {
      place: string
      placeNotFound: string
      startMission: string
      markDone: string
      studyFirst: string
      richerVocab: string
      played: string
      times: string
      comingSoonTitle: string
      comingSoonBody: string
      comingSoonDismiss: string
      lockedBody: string
    }
    play: {
      mission: string
      study: string
      listen: string
      listenAgain: string
      continue: string
      noticeWords: string
      arrive: string
      nextInstruction: string
      missionComplete: string
      studyComplete: string
      youCanNow: string
      youStudied: string
      wordsUsed: string
      wordsInLesson: string
      backToMission: string
      backToStudy: string
      studyAgain: string
      directions: {
        left: string
        right: string
        straight: string
        up: string
        down: string
        stop: string
        arrive: string
      }
    }
    depth: {
      master: string
      advanced: string
      basic: string
      notStarted: string
    }
    companion: {
      kicker: string
      titleUmrah: string
      body: string
      ritesTitle: string
      ritesBody: string
      openHaram: string
      laterTitle: string
      laterBody: string
      backToCompanion: string
      disclaimer: string
    }
    auth: {
      logIn: string
      account: string
      mockName: string
      mockEmail: string
      mockBody: string
      logOut: string
    }
  }
  journeys: Record<JourneyCategory, JourneyStrings>
  chapters: Record<string, string>
  missions: Record<string, string>
  missionDetails: Record<string, MissionStrings>
  capabilities: Record<string, CapabilityStrings>
  /** Optional word glosses keyed by vocabulary id. Falls back to English data when missing. */
  words: Record<string, string>
}

export type SupportedLanguage = "en" | "ur"
