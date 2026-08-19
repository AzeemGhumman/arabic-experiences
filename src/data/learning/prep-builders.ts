import type { AdventureBuildContext, AdventureRun, StudyGroup } from "@/lib/learning-types"

function uniqueIds(ids: string[]) {
  return [...new Set(ids.filter(Boolean))]
}

function prepStudyRun(id: string, outcome: string, groups: StudyGroup[]): AdventureRun {
  return {
    id: `${id}-study`,
    adventureId: id,
    seed: "",
    selectedVocabularyIds: uniqueIds(groups.flatMap((group) => group.vocabIds)),
    variables: {},
    steps: [{ type: "study", groups }],
    outcome,
  }
}

export function buildColorsBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("colors-basic", "You studied basic colors in Arabic.", [
    {
      title: "On the road",
      intro: "Signs, taxi colors, and abaya colors.",
      scene: "street",
      vocabIds: ["color-red", "color-green", "color-white", "color-black", "color-yellow"],
    },
    {
      title: "More common colors",
      vocabIds: ["color-blue", "color-brown", "color-gray"],
    },
  ])
}

export function buildColorsExtended(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("colors-extended", "You studied light, dark, and richer color words.", [
    {
      title: "Light and dark",
      intro: "Describe shades when shopping.",
      scene: "food",
      vocabIds: ["color-light", "color-dark", "color-gold", "color-white", "color-black"],
    },
    {
      title: "Describe something",
      intro: "Light blue bag, dark green sign.",
      vocabIds: ["color-blue", "color-green", "color-brown", "color-gray", "color-red"],
    },
  ])
}

export function buildNumbersTo100(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("numbers-to-100", "You studied tens and larger numbers for buses, prices, and rooms.", [
    {
      title: "Tens",
      intro: "Bus lines, prices, and room floors use these constantly.",
      scene: "bus",
      vocabIds: ["n20", "n30", "n40", "n50", "n60", "n70", "n80", "n90", "n100"],
    },
    {
      title: "Combining",
      intro: "21 = twenty + one. Listen for the pattern.",
      scene: "numbers",
      vocabIds: ["n21", "n35", "n48", "n72", "n99"],
    },
    {
      title: "On signs",
      intro: "Gate numbers and camp numbers.",
      scene: "haram-gate",
      vocabIds: ["number", "gate", "camp", "room-number"],
    },
  ])
}

export function buildNavigationGps(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("navigation-gps", "You studied GPS-style turn-by-turn Arabic.", [
    {
      title: "Turn-by-turn",
      scene: "map",
      vocabIds: ["turn-right", "turn-left", "continue-straight", "after-meters", "you-arrived", "second-left"],
    },
    {
      title: "Landmarks",
      scene: "street",
      vocabIds: ["signal", "bridge", "intersection", "opposite", "behind"],
    },
  ])
}

export function buildFoodMenu(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("food-menu", "You studied common dishes and table items.", [
    {
      title: "Main dishes",
      scene: "food",
      vocabIds: ["chicken", "meat", "rice", "bread", "vegetables", "fruit"],
    },
    {
      title: "Drinks",
      scene: "restaurant",
      vocabIds: ["water", "water-saudi", "tea", "coffee", "juice"],
    },
    {
      title: "Tableware",
      vocabIds: ["plate", "cup", "spoon", "fork"],
    },
    {
      title: "Ordering",
      vocabIds: ["i-want", "i-want-saudi", "please", "the-bill"],
    },
  ])
}

export function buildPoliteBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("polite-basic", "You studied greetings, courtesy, and clarification phrases.", [
    {
      title: "Opening a conversation",
      intro: "You will hear this dozens of times a day.",
      scene: "crowd",
      vocabIds: ["greeting", "greeting-response", "peace-praise"],
    },
    {
      title: "Courtesy",
      vocabIds: ["please", "thank-you", "thank-you-much", "welcome", "sorry", "excuse-me"],
    },
    {
      title: "When you get stuck",
      vocabIds: ["dont-understand", "yes", "no"],
    },
  ])
}

export function buildPackingBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("packing-basic", "You studied Umrah packing and travel essentials.", [
    {
      title: "Documents & money",
      scene: "airport",
      vocabIds: ["passport", "visa", "copy-passport", "riyal", "card"],
    },
    {
      title: "Ihram & wear",
      scene: "airport",
      vocabIds: ["ihram", "sandals", "belt-bag", "abaya", "headscarf"],
    },
    {
      title: "Health & comfort",
      vocabIds: ["medicine", "sunscreen", "towel", "toothbrush", "charger", "umbrella", "snacks"],
    },
  ])
}

export function buildMoneyBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("money-basic", "You studied asking prices and paying.", [
    {
      title: "Asking the price",
      scene: "restaurant",
      vocabIds: ["how-much", "how-much-price", "how-much-saudi", "riyal", "this-one", "that-one"],
    },
    {
      title: "Reacting",
      vocabIds: ["expensive", "cheap", "too-expensive"],
    },
    {
      title: "Paying",
      vocabIds: ["cash", "card", "the-bill", "please", "change-money"],
    },
  ])
}

export function buildHotelBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("hotel-basic", "You studied hotel words from reception to your room.", [
    {
      title: "Finding your room",
      intro: "The reception desk and elevator.",
      scene: "taxi",
      vocabIds: ["hotel", "reception", "room", "room-number", "floor", "elevator", "key"],
    },
    {
      title: "In the room",
      scene: "restaurant",
      vocabIds: ["bathroom", "bed", "ac", "luggage"],
    },
    {
      title: "Asking",
      vocabIds: ["where-is", "please", "here", "there"],
    },
  ])
}

export function buildHaramBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("haram-basic", "You studied key places inside Masjid al-Haram.", [
    {
      title: "The building",
      scene: "tawaf",
      vocabIds: ["haram", "kaaba", "mataf", "courtyard", "gate", "entrance"],
    },
    {
      title: "Ritual places",
      intro: "Words you hear — not a fiqh lesson.",
      scene: "tawaf",
      vocabIds: ["tawaf", "circuit", "black-stone", "safa", "marwah", "masaa", "sai"],
    },
    {
      title: "Finding things",
      scene: "zamzam",
      vocabIds: ["zamzam", "water", "cup", "drinking-area", "where-is", "where-is-saudi"],
    },
  ])
}

export function buildHaramMore(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("haram-more", "You studied crowd instructions and facilities in the Haram.", [
    {
      title: "Crowd instructions",
      scene: "crowd",
      vocabIds: ["walk", "wait", "stop", "enter", "exit-cmd", "men", "women", "families"],
    },
    {
      title: "Prayer & wudu",
      vocabIds: ["prayer", "rakah", "wudu", "open", "closed", "prohibited"],
    },
    {
      title: "Floors & directions",
      vocabIds: ["up", "down", "floor", "this-way", "near", "far"],
    },
  ])
}

export function buildRitualBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("ritual-basic", "You studied Umrah stage words and movement language.", [
    {
      title: "Stages",
      intro: "One word per stage — language only.",
      scene: "tawaf",
      vocabIds: ["ihram", "tawaf", "sai", "talbiyah", "wudu", "prayer"],
    },
    {
      title: "Movement",
      scene: "sai",
      vocabIds: ["walk", "start", "finished", "go-back", "circuit", "faster"],
    },
    {
      title: "States",
      vocabIds: ["open", "closed", "wait", "enter", "prohibited"],
    },
  ])
}

export function buildNabawiBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("nabawi-basic", "You studied Masjid an-Nabawi place names.", [
    {
      title: "The mosque",
      scene: "madinah",
      vocabIds: ["nabawi", "madinah", "green-dome", "courtyard", "gate", "entrance"],
    },
    {
      title: "Asking the way",
      vocabIds: ["prophet-mosque-q", "where-is", "where-is-saudi", "near", "far"],
    },
    {
      title: "Inside",
      intro: "Word recognition only.",
      vocabIds: ["rawdah", "prayer", "wudu", "men", "women"],
    },
  ])
}

export function buildBarberPrep(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("barber-basic", "You studied barber words for shave, trim, and paying.", [
    {
      title: "What you want",
      scene: "barber",
      vocabIds: ["shave", "trim", "complete-cut", "hair", "clippers", "a-little", "only"],
    },
    {
      title: "Paying",
      vocabIds: ["how-much", "how-much-saudi", "please", "the-bill"],
    },
  ])
}

export function buildShoppingBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("shopping-basic", "You studied market shopping and souvenirs.", [
    {
      title: "At the stall",
      scene: "food",
      vocabIds: ["market", "shop", "this-one", "that-one", "how-much", "how-much-saudi"],
    },
    {
      title: "Umrah souvenirs",
      vocabIds: ["dates", "perfume", "prayer-beads", "souvenir", "ihram"],
    },
    {
      title: "Size & price",
      vocabIds: ["size", "big", "small", "expensive", "cheap"],
    },
  ])
}

export function buildHealthBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("health-basic", "You studied feeling sick and finding a pharmacy.", [
    {
      title: "How you feel",
      scene: "emergency",
      vocabIds: ["sick", "tired", "it-hurts", "fever", "thirsty"],
    },
    {
      title: "Getting help",
      vocabIds: ["pharmacy", "doctor", "hospital", "help", "help-me"],
    },
    {
      title: "Medicine",
      scene: "emergency",
      vocabIds: ["medicine", "water", "allergy"],
    },
  ])
}

export function buildBodyBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("body-basic", "You studied body parts and pointing to pain.", [
    {
      title: "Head & face",
      vocabIds: ["head", "hair", "eye", "ear", "throat"],
    },
    {
      title: "Torso & limbs",
      vocabIds: ["hand", "chest", "stomach", "back", "foot", "leg"],
    },
    {
      title: "It hurts here",
      vocabIds: ["it-hurts", "here", "doctor", "pharmacy"],
    },
  ])
}

export function buildFamilyBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("family-basic", "You studied words for your group and who you are looking for.", [
    {
      title: "Your group",
      scene: "lost",
      vocabIds: ["my-family", "my-group", "my-husband", "my-wife", "my-son", "my-daughter"],
    },
    {
      title: "Looking for someone",
      vocabIds: ["looking-for", "child", "phone", "gate", "hotel"],
    },
    {
      title: "If you are lost",
      vocabIds: ["i-am-lost-m", "i-am-lost-f", "help-me", "where-is"],
    },
  ])
}

export function buildFamilyMore(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("family-more", "You studied extended family words.", [
    {
      title: "Close family",
      scene: "lost",
      vocabIds: ["father", "mother", "brother", "sister", "son", "daughter"],
    },
    {
      title: "Extended",
      vocabIds: ["grandfather", "uncle", "children", "families"],
    },
    {
      title: "Describing your group",
      vocabIds: ["my-family", "my-group", "with", "here", "there"],
    },
  ])
}

export function buildTimeBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("time-basic", "You studied now, today, tomorrow, and wait times.", [
    {
      title: "Right now",
      scene: "numbers",
      vocabIds: ["now", "today", "tomorrow", "when"],
    },
    {
      title: "How long",
      vocabIds: ["hour", "minute", "half-hour", "how-many-minutes", "after", "before"],
    },
    {
      title: "Day parts",
      vocabIds: ["morning", "evening", "wait"],
    },
  ])
}

export function buildClothesBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("clothes-basic", "You studied ihram, sandals, and clothes shopping.", [
    {
      title: "Ihram & footwear",
      scene: "food",
      vocabIds: ["ihram", "sandals", "belt-bag", "abaya", "headscarf"],
    },
    {
      title: "Shopping for fit",
      vocabIds: ["size", "big", "small", "try-on", "how-much-saudi"],
    },
    {
      title: "Care",
      vocabIds: ["laundry", "clean", "towel"],
    },
  ])
}

export function buildActionsBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("actions-basic", "You studied movement, waiting, and permission words.", [
    {
      title: "Movement",
      intro: "Instructions to keep moving.",
      scene: "crowd",
      vocabIds: ["walk", "come", "enter", "exit-cmd", "go-back", "faster"],
    },
    {
      title: "Waiting & stopping",
      vocabIds: ["wait", "stop", "start", "finished"],
    },
    {
      title: "Permission & signs",
      vocabIds: ["prohibited", "open", "closed", "this-way", "toward"],
    },
  ])
}

export function buildAdjectivesBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("adjectives-basic", "You studied size, condition, and comfort words.", [
    {
      title: "Size",
      vocabIds: ["big", "small", "heavy", "light-weight"],
    },
    {
      title: "Condition",
      vocabIds: ["new", "old", "clean", "broken"],
    },
    {
      title: "Comfort",
      vocabIds: ["hot", "cold", "near", "far", "tired"],
    },
  ])
}

export function buildGeographyBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("geography-basic", "You studied holy cities and arrival places.", [
    {
      title: "Holy cities",
      scene: "map",
      vocabIds: ["makkah", "madinah", "jeddah", "holy-land"],
    },
    {
      title: "Arrival",
      scene: "airport",
      vocabIds: ["airport", "taxi", "bus", "toward"],
    },
  ])
}

export function buildNatureBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("nature-basic", "You studied heat, sun, and asking for water and shade.", [
    {
      title: "Outdoors",
      scene: "bus",
      vocabIds: ["sun", "hot", "sand", "wind", "shade"],
    },
    {
      title: "How you feel",
      vocabIds: ["tired", "thirsty", "water", "water-saudi", "please"],
    },
  ])
}

export function buildRoomServiceBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("room-service-basic", "You studied hotel room requests and problems.", [
    {
      title: "Requests",
      scene: "restaurant",
      vocabIds: ["towel", "clean", "please", "i-want", "i-want-saudi"],
    },
    {
      title: "Problems",
      vocabIds: ["broken", "ac", "bathroom", "help", "help-me"],
    },
    {
      title: "Delivery words",
      vocabIds: ["here", "there", "room", "floor"],
    },
  ])
}

export function buildHajjPlacesBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("hajj-places-basic", "You studied Hajj place names and transport words.", [
    {
      title: "Places",
      scene: "bus",
      vocabIds: ["mina", "arafat", "muzdalifah", "jamarat", "makkah", "camp", "tent"],
    },
    {
      title: "Transport",
      vocabIds: ["bus", "seat", "station", "number", "wait"],
    },
    {
      title: "Words you hear",
      intro: "Language only — not a fiqh lesson.",
      vocabIds: ["throw-stones", "day-of-arafah", "walk", "stop"],
    },
  ])
}

export function buildTransportBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("transport-basic", "You studied taxi, bus, and station words.", [
    {
      title: "Vehicles",
      scene: "taxi",
      vocabIds: ["taxi", "bus", "car", "seat"],
    },
    {
      title: "Places",
      scene: "airport",
      vocabIds: ["station", "airport", "train-station", "stop-here"],
    },
    {
      title: "Directions",
      vocabIds: ["toward", "here", "there", "please"],
    },
  ])
}

export function buildAirportBasic(_ctx: AdventureBuildContext): AdventureRun {
  return prepStudyRun("airport-basic", "You studied airport arrival words.", [
    {
      title: "At the desk",
      scene: "immigration",
      vocabIds: ["passport", "officer", "window-counter", "wait", "please"],
    },
    {
      title: "Finding your way",
      scene: "airport",
      vocabIds: ["bag", "exit-sign", "taxi", "where-is"],
    },
    {
      title: "Onward travel",
      vocabIds: ["airport", "hotel", "makkah", "madinah"],
    },
  ])
}
