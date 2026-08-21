import type { MissionBuildContext, MissionRun, StudyGroup } from "@/lib/learning-types"

function uniqueIds(ids: string[]) {
  return [...new Set(ids.filter(Boolean))]
}

function studyRun(id: string, outcome: string, groups: StudyGroup[]): MissionRun {
  return {
    id: `${id}-study`,
    missionId: id,
    seed: "",
    selectedVocabularyIds: uniqueIds(groups.flatMap((group) => group.vocabIds)),
    variables: {},
    steps: [{ type: "study", groups }],
    outcome,
  }
}

export function buildColorsBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("colors-basic", "You studied basic colors in Arabic.", [
    {
      title: "On the road",
      copyKey: "on-the-road",
      intro: "Signs, taxi colors, and abaya colors.",
      scene: "street",
      vocabIds: ["color-red", "color-green", "color-white", "color-black", "color-yellow"],
    },
    {
      title: "More common colors",
      copyKey: "more-common-colors",
      vocabIds: ["color-blue", "color-brown", "color-gray"],
    },
  ])
}

export function buildColorsExtended(_ctx: MissionBuildContext): MissionRun {
  return studyRun("colors-extended", "You studied light, dark, and richer color words.", [
    {
      title: "Light and dark",
      copyKey: "light-and-dark",
      intro: "Describe shades when shopping.",
      scene: "food",
      vocabIds: ["color-light", "color-dark", "color-gold", "color-white", "color-black"],
    },
    {
      title: "Describe something",
      copyKey: "describe-something",
      intro: "Light blue bag, dark green sign.",
      vocabIds: ["color-blue", "color-green", "color-brown", "color-gray", "color-red"],
    },
  ])
}

export function buildNumbersTo100(_ctx: MissionBuildContext): MissionRun {
  return studyRun("numbers-to-100", "You studied tens and larger numbers for buses, prices, and rooms.", [
    {
      title: "Tens",
      copyKey: "tens",
      intro: "Bus lines, prices, and room floors use these constantly.",
      scene: "bus",
      vocabIds: ["n20", "n30", "n40", "n50", "n60", "n70", "n80", "n90", "n100"],
    },
    {
      title: "Combining",
      copyKey: "combining",
      intro: "21 = twenty + one. Listen for the pattern.",
      scene: "numbers",
      vocabIds: ["n21", "n35", "n48", "n72", "n99"],
    },
    {
      title: "On signs",
      copyKey: "on-signs",
      intro: "Gate numbers and room numbers.",
      scene: "haram-gate",
      vocabIds: ["number", "gate", "bus", "room-number"],
    },
  ])
}

export function buildNavigationGps(_ctx: MissionBuildContext): MissionRun {
  return studyRun("navigation-gps", "You studied GPS-style turn-by-turn Arabic.", [
    {
      title: "Turn-by-turn",
      copyKey: "turn-by-turn",
      scene: "map",
      vocabIds: ["turn-right", "turn-left", "continue-straight", "after-meters", "you-arrived", "second-left"],
    },
    {
      title: "Landmarks",
      copyKey: "landmarks",
      scene: "street",
      vocabIds: ["signal", "bridge", "intersection", "opposite", "behind"],
    },
  ])
}

export function buildFoodMenu(_ctx: MissionBuildContext): MissionRun {
  return studyRun("food-menu", "You studied common dishes and table items.", [
    {
      title: "Main dishes",
      copyKey: "main-dishes",
      scene: "food",
      vocabIds: ["chicken", "meat", "rice", "bread", "vegetables", "fruit"],
    },
    {
      title: "Drinks",
      copyKey: "drinks",
      scene: "restaurant",
      vocabIds: ["water", "water-saudi", "tea", "coffee", "juice"],
    },
    {
      title: "Tableware",
      copyKey: "tableware",
      vocabIds: ["plate", "cup", "spoon", "fork"],
    },
    {
      title: "Ordering",
      copyKey: "ordering",
      vocabIds: ["i-want", "i-want-saudi", "please", "the-bill"],
    },
  ])
}

export function buildPoliteBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("polite-basic", "You studied greetings, courtesy, and clarification phrases.", [
    {
      title: "Opening a conversation",
      copyKey: "opening-a-conversation",
      intro: "You will hear this dozens of times a day.",
      scene: "crowd",
      vocabIds: ["greeting", "greeting-response", "peace-praise"],
    },
    {
      title: "Courtesy",
      copyKey: "courtesy",
      vocabIds: ["please", "thank-you", "thank-you-much", "welcome", "sorry", "excuse-me"],
    },
    {
      title: "When you get stuck",
      copyKey: "when-you-get-stuck",
      vocabIds: ["dont-understand", "yes", "no"],
    },
  ])
}

export function buildPackingBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("packing-basic", "You studied Umrah packing and travel essentials.", [
    {
      title: "Documents & money",
      copyKey: "documents-money",
      scene: "airport",
      vocabIds: ["passport", "visa", "copy-passport", "riyal", "card"],
    },
    {
      title: "Ihram & wear",
      copyKey: "ihram-wear",
      scene: "airport",
      vocabIds: ["ihram", "sandals", "belt-bag", "abaya", "headscarf"],
    },
    {
      title: "Health & comfort",
      copyKey: "health-comfort",
      vocabIds: ["medicine", "sunscreen", "towel", "toothbrush", "charger", "umbrella", "snacks"],
    },
  ])
}

export function buildMoneyBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("money-basic", "You studied asking prices and paying.", [
    {
      title: "Asking the price",
      copyKey: "asking-the-price",
      scene: "restaurant",
      vocabIds: ["how-much", "how-much-price", "how-much-saudi", "riyal", "this-one", "that-one"],
    },
    {
      title: "Reacting",
      copyKey: "reacting",
      vocabIds: ["expensive", "cheap", "too-expensive"],
    },
    {
      title: "Paying",
      copyKey: "paying",
      vocabIds: ["cash", "card", "the-bill", "please", "change-money"],
    },
  ])
}

export function buildHotelBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("hotel-basic", "You studied hotel words from reception to your room.", [
    {
      title: "Finding your room",
      copyKey: "finding-your-room",
      intro: "The reception desk and elevator.",
      scene: "taxi",
      vocabIds: ["hotel", "reception", "room", "room-number", "floor", "elevator", "key"],
    },
    {
      title: "In the room",
      copyKey: "in-the-room",
      scene: "restaurant",
      vocabIds: ["bathroom", "bed", "ac", "luggage"],
    },
    {
      title: "Asking",
      copyKey: "asking",
      vocabIds: ["where-is", "please", "here", "there"],
    },
  ])
}

export function buildHaramBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("haram-basic", "You studied key places inside Masjid al-Haram.", [
    {
      title: "The building",
      copyKey: "the-building",
      scene: "tawaf",
      vocabIds: ["haram", "kaaba", "mataf", "courtyard", "gate", "entrance"],
    },
    {
      title: "Ritual places",
      copyKey: "ritual-places",
      intro: "Words you hear — not a fiqh lesson.",
      scene: "tawaf",
      vocabIds: ["tawaf", "circuit", "black-stone", "safa", "marwah", "masaa", "sai"],
    },
    {
      title: "Finding things",
      copyKey: "finding-things",
      scene: "zamzam",
      vocabIds: ["zamzam", "water", "cup", "drinking-area", "where-is", "where-is-saudi"],
    },
  ])
}

export function buildHaramMore(_ctx: MissionBuildContext): MissionRun {
  return studyRun("haram-more", "You studied crowd instructions and facilities in the Haram.", [
    {
      title: "Crowd instructions",
      copyKey: "crowd-instructions",
      scene: "crowd",
      vocabIds: ["walk", "wait", "stop", "enter", "exit-cmd", "men", "women", "families"],
    },
    {
      title: "Prayer & wudu",
      copyKey: "prayer-wudu",
      vocabIds: ["prayer", "rakah", "wudu", "open", "closed", "prohibited"],
    },
    {
      title: "Floors & directions",
      copyKey: "floors-directions",
      vocabIds: ["up", "down", "floor", "this-way", "near", "far"],
    },
  ])
}

export function buildRitualBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("ritual-basic", "You studied Umrah stage words and movement language.", [
    {
      title: "Stages",
      copyKey: "stages",
      intro: "One word per stage — language only.",
      scene: "tawaf",
      vocabIds: ["ihram", "tawaf", "sai", "talbiyah", "wudu", "prayer"],
    },
    {
      title: "Movement",
      copyKey: "movement",
      scene: "sai",
      vocabIds: ["walk", "start", "finished", "go-back", "circuit", "faster"],
    },
    {
      title: "States",
      copyKey: "states",
      vocabIds: ["open", "closed", "wait", "enter", "prohibited"],
    },
  ])
}

export function buildNabawiBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("nabawi-basic", "You studied Masjid an-Nabawi place names.", [
    {
      title: "The mosque",
      copyKey: "the-mosque",
      scene: "madinah",
      vocabIds: ["nabawi", "madinah", "green-dome", "courtyard", "gate", "entrance"],
    },
    {
      title: "Asking the way",
      copyKey: "asking-the-way",
      vocabIds: ["prophet-mosque-q", "where-is", "where-is-saudi", "near", "far"],
    },
    {
      title: "Inside",
      copyKey: "inside",
      intro: "Word recognition only.",
      vocabIds: ["rawdah", "prayer", "wudu", "men", "women"],
    },
  ])
}

export function buildBarberBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("barber-basic", "You studied barber words for shave, trim, and paying.", [
    {
      title: "What you want",
      copyKey: "what-you-want",
      scene: "barber",
      vocabIds: ["shave", "trim", "complete-cut", "hair", "clippers", "a-little", "only"],
    },
    {
      title: "Paying",
      copyKey: "paying",
      vocabIds: ["how-much", "how-much-saudi", "please", "the-bill"],
    },
  ])
}

export function buildShoppingBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("shopping-basic", "You studied market shopping and souvenirs.", [
    {
      title: "At the stall",
      copyKey: "at-the-stall",
      scene: "food",
      vocabIds: ["market", "shop", "this-one", "that-one", "how-much", "how-much-saudi"],
    },
    {
      title: "Umrah souvenirs",
      copyKey: "umrah-souvenirs",
      vocabIds: ["dates", "perfume", "prayer-beads", "souvenir", "ihram"],
    },
    {
      title: "Size & price",
      copyKey: "size-price",
      vocabIds: ["size", "big", "small", "expensive", "cheap"],
    },
  ])
}

export function buildHealthBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("health-basic", "You studied feeling sick and finding a pharmacy.", [
    {
      title: "How you feel",
      copyKey: "how-you-feel",
      scene: "emergency",
      vocabIds: ["sick", "tired", "it-hurts", "fever", "thirsty"],
    },
    {
      title: "Getting help",
      copyKey: "getting-help",
      vocabIds: ["pharmacy", "doctor", "hospital", "help", "help-me"],
    },
    {
      title: "Medicine",
      copyKey: "medicine",
      scene: "emergency",
      vocabIds: ["medicine", "water", "allergy"],
    },
  ])
}

export function buildBodyBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("body-basic", "You studied body parts and pointing to pain.", [
    {
      title: "Head & face",
      copyKey: "head-face",
      vocabIds: ["head", "hair", "eye", "ear", "throat"],
    },
    {
      title: "Torso & limbs",
      copyKey: "torso-limbs",
      vocabIds: ["hand", "chest", "stomach", "back", "foot", "leg"],
    },
    {
      title: "It hurts here",
      copyKey: "it-hurts-here",
      vocabIds: ["it-hurts", "here", "doctor", "pharmacy"],
    },
  ])
}

export function buildFamilyBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("family-basic", "You studied words for your group and who you are looking for.", [
    {
      title: "Your group",
      copyKey: "your-group",
      scene: "lost",
      vocabIds: ["my-family", "my-group", "my-husband", "my-wife", "my-son", "my-daughter"],
    },
    {
      title: "Looking for someone",
      copyKey: "looking-for-someone",
      vocabIds: ["looking-for", "child", "phone", "gate", "hotel"],
    },
    {
      title: "If you are lost",
      copyKey: "if-you-are-lost",
      vocabIds: ["i-am-lost-m", "i-am-lost-f", "help-me", "where-is"],
    },
  ])
}

export function buildFamilyMore(_ctx: MissionBuildContext): MissionRun {
  return studyRun("family-more", "You studied extended family words.", [
    {
      title: "Close family",
      copyKey: "close-family",
      scene: "lost",
      vocabIds: ["father", "mother", "brother", "sister", "son", "daughter"],
    },
    {
      title: "Extended",
      copyKey: "extended",
      vocabIds: ["grandfather", "uncle", "children", "families"],
    },
    {
      title: "Describing your group",
      copyKey: "describing-your-group",
      vocabIds: ["my-family", "my-group", "with", "here", "there"],
    },
  ])
}

export function buildTimeBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("time-basic", "You studied now, today, tomorrow, and wait times.", [
    {
      title: "Right now",
      copyKey: "right-now",
      scene: "numbers",
      vocabIds: ["now", "today", "tomorrow", "when"],
    },
    {
      title: "How long",
      copyKey: "how-long",
      vocabIds: ["hour", "minute", "half-hour", "how-many-minutes", "after", "before"],
    },
    {
      title: "Day parts",
      copyKey: "day-parts",
      vocabIds: ["morning", "evening", "wait"],
    },
  ])
}

export function buildClothesBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("clothes-basic", "You studied ihram, sandals, and clothes shopping.", [
    {
      title: "Ihram & footwear",
      copyKey: "ihram-footwear",
      scene: "food",
      vocabIds: ["ihram", "sandals", "belt-bag", "abaya", "headscarf"],
    },
    {
      title: "Shopping for fit",
      copyKey: "shopping-for-fit",
      vocabIds: ["size", "big", "small", "try-on", "how-much-saudi"],
    },
    {
      title: "Care",
      copyKey: "care",
      vocabIds: ["laundry", "clean", "towel"],
    },
  ])
}

export function buildActionsBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("actions-basic", "You studied movement, waiting, and permission words.", [
    {
      title: "Movement",
      copyKey: "movement",
      intro: "Instructions to keep moving.",
      scene: "crowd",
      vocabIds: ["walk", "come", "enter", "exit-cmd", "go-back", "faster"],
    },
    {
      title: "Waiting & stopping",
      copyKey: "waiting-stopping",
      vocabIds: ["wait", "stop", "start", "finished"],
    },
    {
      title: "Permission & signs",
      copyKey: "permission-signs",
      vocabIds: ["prohibited", "open", "closed", "this-way", "toward"],
    },
  ])
}

export function buildAdjectivesBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("adjectives-basic", "You studied size, condition, and comfort words.", [
    {
      title: "Size",
      copyKey: "size",
      vocabIds: ["big", "small", "heavy", "light-weight"],
    },
    {
      title: "Condition",
      copyKey: "condition",
      vocabIds: ["new", "old", "clean", "broken"],
    },
    {
      title: "Comfort",
      copyKey: "comfort",
      vocabIds: ["hot", "cold", "near", "far", "tired"],
    },
  ])
}

export function buildGeographyBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("geography-basic", "You studied holy cities and arrival places.", [
    {
      title: "Holy cities",
      copyKey: "holy-cities",
      scene: "map",
      vocabIds: ["makkah", "madinah", "jeddah", "holy-land"],
    },
    {
      title: "Arrival",
      copyKey: "arrival",
      scene: "airport",
      vocabIds: ["airport", "taxi", "bus", "toward"],
    },
  ])
}

export function buildNatureBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("nature-basic", "You studied heat, sun, and asking for water and shade.", [
    {
      title: "Outdoors",
      copyKey: "outdoors",
      scene: "bus",
      vocabIds: ["sun", "hot", "sand", "wind", "shade"],
    },
    {
      title: "How you feel",
      copyKey: "how-you-feel",
      vocabIds: ["tired", "thirsty", "water", "water-saudi", "please"],
    },
  ])
}

export function buildRoomServiceBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("room-service-basic", "You studied hotel room requests and problems.", [
    {
      title: "Requests",
      copyKey: "requests",
      scene: "restaurant",
      vocabIds: ["towel", "clean", "please", "i-want", "i-want-saudi"],
    },
    {
      title: "Problems",
      copyKey: "problems",
      vocabIds: ["broken", "ac", "bathroom", "help", "help-me"],
    },
    {
      title: "Delivery words",
      copyKey: "delivery-words",
      vocabIds: ["here", "there", "room", "floor"],
    },
  ])
}

export function buildTransportBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("transport-basic", "You studied taxi, bus, and station words.", [
    {
      title: "Vehicles",
      copyKey: "vehicles",
      scene: "taxi",
      vocabIds: ["taxi", "bus", "car", "seat"],
    },
    {
      title: "Places",
      copyKey: "places",
      scene: "airport",
      vocabIds: ["station", "airport", "train-station", "stop-here"],
    },
    {
      title: "Directions",
      copyKey: "directions",
      vocabIds: ["toward", "here", "there", "please"],
    },
  ])
}

export function buildAirportBasic(_ctx: MissionBuildContext): MissionRun {
  return studyRun("airport-basic", "You studied airport arrival words.", [
    {
      title: "At the desk",
      copyKey: "at-the-desk",
      scene: "immigration",
      vocabIds: ["passport", "officer", "window-counter", "wait", "please"],
    },
    {
      title: "Finding your way",
      copyKey: "finding-your-way",
      scene: "airport",
      vocabIds: ["bag", "exit-sign", "taxi", "where-is"],
    },
    {
      title: "Onward travel",
      copyKey: "onward-travel",
      vocabIds: ["airport", "hotel", "makkah", "madinah"],
    },
  ])
}
