import type { MissionBuildContext, MissionRun, MissionStep, DirectionAction } from "@/lib/learning-types"
import { getLearningWord } from "@/data/learning/words"

function pick<T>(rand: () => number, items: T[]): T {
  return items[Math.floor(rand() * items.length)] ?? items[0]
}

function uniqueIds(ids: string[]) {
  return [...new Set(ids.filter(Boolean))]
}

function arabicOf(id: string) {
  return getLearningWord(id)?.arabic ?? id
}

/** MCQ option with spoken Arabic audio for immersive response mode. */
function spokenOption(id: string, label: string, arabic: string, audioId = `opt-${id}`) {
  return { id, label, arabic, audioId }
}

export function buildImmigration(ctx: MissionBuildContext): MissionRun {
  const profile = pick(ctx.rand, [
    { nameAr: "أزيم", countryAr: "باكستان", countryEn: "Pakistan" },
    { nameAr: "فاطمة", countryAr: "الهند", countryEn: "India" },
    { nameAr: "سارة", countryAr: "بريطانيا", countryEn: "Britain" },
  ])

  const companion = pick(ctx.rand, [
    {
      id: "family",
      audioId: "with-whom",
      officerArabic: "مع من أنت؟",
      promptEnglish: "Who are you with?",
      question: "How do you answer?",
      correctId: "with-family",
      feedback: "The officer notes your family and continues.",
    },
    {
      id: "father",
      audioId: "with-whom",
      officerArabic: "مع من أنت؟",
      promptEnglish: "Who are you with?",
      question: "How do you answer?",
      correctId: "with-father",
      feedback: "The officer nods and moves on.",
    },
  ])

  const vocabIds = uniqueIds([
    "greeting",
    "greeting-response",
    "passport",
    "thank-you",
    "yes",
    "no",
    "my-family",
    "please",
    "bag",
    "phone",
    "ihram",
    "sandals",
    "charger",
    "medicine",
  ])

  const steps: MissionStep[] = [
    {
      type: "context",
      copyKey: "context",
      title: "Passport control",
      body: "You have just landed in Saudi Arabia for Umrah. An immigration officer calls you forward to the desk.",
      scene: "immigration",
    },
    {
      type: "listen",
      copyKey: "greeting",
      prompt: "The officer looks up and greets you.",
      promptEnglish: "Peace be upon you",
      question: "How would you respond?",
      arabic: arabicOf("greeting"),
      audioId: "greeting",
      options: [
        spokenOption("greeting-response", "And upon you peace", arabicOf("greeting-response")),
        spokenOption("thank-you", "Thank you", arabicOf("thank-you")),
        spokenOption("please", "Please", arabicOf("please")),
      ],
      correctId: "greeting-response",
      feedback: "The officer nods and continues.",
    },
    {
      type: "listen",
      copyKey: "passport",
      prompt: "The officer holds out his hand.",
      promptEnglish: "Your passport, please",
      question: "What does he want?",
      arabic: "جواز السفر، من فضلك",
      audioId: "passport-please",
      options: [
        spokenOption("passport", "Passport", arabicOf("passport")),
        spokenOption("bag", "Suitcase", arabicOf("bag")),
        spokenOption("phone", "Phone", arabicOf("phone")),
      ],
      correctId: "passport",
      feedback: "You hand over your passport.",
    },
    {
      type: "match",
      copyKey: "match",
      prompt: "While he checks your papers, he glances at the open bag beside you.",
      question: "Match each item to its Arabic name.",
      itemIds: ["ihram", "sandals", "charger", "medicine"],
      feedback: "Good packing for Umrah — the officer nods and keeps typing.",
    },
    {
      type: "phrase",
      copyKey: "whyHere",
      prompt: "The officer asks why you are here.",
      audioId: "why-here",
      officerArabic: "لماذا أنت هنا؟",
      promptEnglish: "Why are you here?",
      tokens: ["أنا", "هنا", "للعمرة"],
      correctOrder: ["أنا", "هنا", "للعمرة"],
      feedback: "You say: أنا هنا للعمرة. The officer nods.",
    },
    {
      type: "listen",
      copyKey: "proceed",
      prompt: "The officer stamps your passport and hands it back.",
      promptEnglish: "Go ahead",
      question: "How do you reply?",
      arabic: "تفضل",
      audioId: "proceed",
      options: [
        spokenOption("thank-you", "Thank you", arabicOf("thank-you")),
        spokenOption("please", "Please", arabicOf("please")),
        spokenOption("greeting-response", "And upon you peace", arabicOf("greeting-response")),
      ],
      correctId: "thank-you",
      feedback: "You step away from the desk. Passport control is done.",
    },
  ]

  return {
    id: `immigration-${profile.nameAr}-${companion.id}`,
    missionId: "immigration",
    seed: "",
    selectedVocabularyIds: vocabIds,
    variables: {
      learnerName: profile.nameAr,
      learnerCountry: profile.countryAr,
      companion: companion.id,
    },
    steps,
    outcome: "You passed passport control and introduced yourself in Arabic.",
  }
}

export function buildFindHaram(ctx: MissionBuildContext): MissionRun {
  const gate = pick(ctx.rand, [79, 84, 1, 5, 8])
  const dir1 = pick(ctx.rand, ["right", "left", "straight"] as const)
  const dir2 = pick(
    ctx.rand,
    (["right", "left", "up", "straight"] as const).filter((item) => item !== dir1),
  )
  const complication = pick(ctx.rand, [
    { id: "closed", title: "The entrance is closed", vocab: "closed" },
    { id: "women", title: "This entrance is for women", vocab: "women" },
    { id: "families", title: "Families this way", vocab: "families" },
    { id: "floor", title: "Wrong floor", vocab: "up" },
  ])
  const nav = ctx.pickFromPool("navigation.basic", 5)
  const vocabIds = uniqueIds([...nav.map((w) => w.id), "where-is", "gate", "haram", dir1, dir2, complication.vocab])

  const dirLabel: Record<string, string> = {
    right: "right",
    left: "left",
    straight: "straight",
    up: "upstairs",
  }

  const steps: MissionStep[] = [
    {
      type: "context",
      title: "Find your way to the Haram",
      body: `The street opens onto three arches. A guard stands near Gate ${gate}. Look at the plaque, then ask.`,
      scene: "haram-gate",
    },
    {
      type: "discover",
      prompt: "Notice the words you will need to ask and to listen.",
      vocabIds: uniqueIds(["where-is", "gate", "right", "left", "straight"]).slice(0, 5),
    },
    {
      type: "phrase",
      prompt: `Ask: Where is Gate ${gate}? The number is on the plaque.`,
      tokens: shuffle(ctx.rand, ["أين", "باب", String(gate), "؟"]),
      correctOrder: ["أين", "باب", String(gate), "؟"],
    },
    {
      type: "listen",
      prompt: "The guard answers. What did you hear?",
      arabic: `${arabicOf(dir1)} ثم ${arabicOf(dir2)}`,
      options: [
        { id: `${dir1}-${dir2}`, label: `${dirLabel[dir1]}, then ${dirLabel[dir2]}` },
        { id: "swap", label: `${dirLabel[dir2]}, then ${dirLabel[dir1]}` },
        { id: "far", label: "It is far. Take a taxi." },
      ],
      correctId: `${dir1}-${dir2}`,
    },
    {
      type: "direction",
      prompt: "Walk the first part. Tap a path on the street.",
      arabic: arabicOf(dir1),
      options: unique(["left", "right", "straight", dir1]) as DirectionAction[],
      correct: dir1,
    },
    {
      type: "direction",
      prompt: "Now the second part. Keep walking.",
      arabic: arabicOf(dir2),
      options: unique(["left", "right", "straight", "up", dir2]) as DirectionAction[],
      correct: dir2,
    },
    {
      type: "decision",
      prompt: "You reach an entrance.",
      situation: complication.title + ". What do you do?",
      options: [
        { id: "other", label: "Ask for another entrance", arabic: arabicOf("where-is") },
        { id: "force", label: "Go in anyway" },
        { id: "leave", label: "Return to the hotel" },
      ],
      correctId: "other",
    },
    {
      type: "choice",
      prompt: "You ask again. Which question fits?",
      options: [
        { id: "where", label: "Where is the open gate?", arabic: "أين الباب المفتوح؟" },
        { id: "food", label: "I want rice", arabic: "أريد أرز" },
        { id: "price", label: "How much?", arabic: "كم؟" },
      ],
      correctId: "where",
    },
  ]

  return {
    id: `find-haram-${gate}-${dir1}`,
    missionId: "find-haram",
    seed: "",
    selectedVocabularyIds: vocabIds,
    selectedComplicationId: complication.id,
    variables: { gateNumber: gate, direction1: dir1, direction2: dir2 },
    steps,
    outcome: `You found Gate ${gate}.`,
  }
}

export function buildEnterHaram(ctx: MissionBuildContext): MissionRun {
  const group = pick(ctx.rand, [
    { id: "men", label: "men", arabic: "رجال" },
    { id: "women", label: "women", arabic: "نساء" },
    { id: "families", label: "families", arabic: "عائلات" },
  ])
  const vocabIds = uniqueIds([
    "walk",
    "wait",
    "stop",
    "this-way",
    "prohibited",
    "closed",
    "open",
    group.id,
    "enter",
  ])

  const steps: MissionStep[] = [
    {
      type: "context",
      title: "Enter Masjid al-Haram",
      body: `The courtyard is full. You are entering with ${group.label}. Listen first. Do not rush the door.`,
      scene: "crowd",
    },
    {
      type: "discover",
      prompt: "These signs and voices keep the crowd moving.",
      vocabIds: ["walk", "wait", "open", "closed", "men", "women"],
    },
    {
      type: "listen",
      prompt: "A volunteer points and says:",
      arabic: "من هنا",
      options: [
        { id: "this-way", label: "This way" },
        { id: "stop", label: "Stop here" },
        { id: "leave", label: "Go back outside" },
      ],
      correctId: "this-way",
    },
    {
      type: "choice",
      prompt: `Which entrance is for ${group.label}?`,
      arabic: group.arabic,
      options: [
        { id: "men", label: "Men", arabic: "رجال" },
        { id: "women", label: "Women", arabic: "نساء" },
        { id: "families", label: "Families", arabic: "عائلات" },
      ],
      correctId: group.id,
    },
    {
      type: "decision",
      prompt: "The nearest door shows:",
      situation: "مغلق",
      options: [
        { id: "wait-open", label: "Find one that is open", arabic: "مفتوح" },
        { id: "push", label: "Push through anyway" },
        { id: "sit", label: "Sit in the street" },
      ],
      correctId: "wait-open",
    },
    {
      type: "direction",
      prompt: "A sign says keep moving.",
      arabic: "امشِ",
      options: ["straight", "stop", "left"],
      correct: "straight",
    },
  ]

  return {
    id: `enter-haram-${group.id}`,
    missionId: "enter-haram",
    seed: "",
    selectedVocabularyIds: vocabIds,
    selectedComplicationId: "closed-door",
    variables: { group: group.id },
    steps,
    outcome: `You entered with the ${group.label} entrance.`,
  }
}

export function buildTaxi(ctx: MissionBuildContext): MissionRun {
  const advanced = (ctx.capabilities.navigation ?? 0) >= 2
  const dest = pick(ctx.rand, ["hotel", "haram", "airport"])
  const destWord = dest === "hotel" ? "الفندق" : dest === "haram" ? "الحرم" : "المطار"
  const destEn = dest === "hotel" ? "the hotel" : dest === "haram" ? "the Haram" : "the airport"

  if (advanced) {
    const vocabIds = uniqueIds([
      "continue-straight",
      "turn-left",
      "opposite",
      "signal",
      "stop-here",
      "hotel",
      "how-much",
    ])
    const steps: MissionStep[] = [
      {
        type: "context",
        title: "Taxi with richer directions",
        body: `Because you already follow multi-step directions, this driver talks like a GPS. Destination: ${destEn}.`,
        scene: "taxi",
      },
      {
        type: "gps",
        prompt: "Follow the spoken route to the hotel.",
        instructions: [
          {
            arabic: "استمر مباشرةً",
            meaning: "Continue straight",
            action: "straight",
            audioId: "gps-continue-straight",
          },
          {
            arabic: "بعد ٢٠٠ متر، خذ ثاني يسار",
            meaning: "After 200 meters, take the second left",
            action: "left",
            audioId: "gps-second-left",
          },
          {
            arabic: "قف مقابل الفندق",
            meaning: "Stop opposite the hotel",
            action: "stop",
            audioId: "gps-stop-opposite-hotel",
          },
          {
            arabic: "لقد وصلت إلى وجهتك",
            meaning: "You have arrived",
            action: "arrive",
            audioId: "gps-arrived",
          },
        ],
      },
      {
        type: "choice",
        prompt: "You want to confirm the fare.",
        options: [
          { id: "price", label: "How much is it?", arabic: "كم السعر؟" },
          { id: "gate", label: "Where is Gate 79?", arabic: "أين باب ٧٩؟" },
          { id: "walk", label: "Keep walking", arabic: "امشِ" },
        ],
        correctId: "price",
      },
    ]
    return {
      id: `taxi-advanced-${dest}`,
      missionId: "taxi-hotel",
      seed: "",
      selectedVocabularyIds: vocabIds,
      variables: { destination: dest, variant: "advanced" },
      steps,
      outcome: `You reached ${destEn} using richer directions.`,
      advanced: true,
    }
  }

  const dir = pick(ctx.rand, ["right", "left"] as const)
  const complication = pick(ctx.rand, ["closed-road", "which-entrance", "stop-early"])
  const vocabIds = uniqueIds(["hotel", "here", "stop-here", "please", "how-much", "i-want", "toward", dir, "near", "far"])

  const complicationCopy =
    complication === "closed-road"
      ? {
          situation: "The road to the hotel is closed. The driver pulls over.",
          prompt: "Which Arabic do you say?",
        }
      : complication === "which-entrance"
        ? {
            situation: "The driver asks which hotel entrance you want.",
            prompt: "Which Arabic do you say?",
          }
        : {
            situation: "You recognise the area and want to get out a little early.",
            prompt: "Which Arabic do you say?",
          }

  const stopPhrase = `${arabicOf("stop-here")} ${arabicOf("please")}`

  const wantWord = arabicOf("i-want")
  const pleaseWord = arabicOf("please")
  const otherDests = (["hotel", "haram", "airport"] as const)
    .filter((place) => place !== dest)
    .map((place) => (place === "hotel" ? "الفندق" : place === "haram" ? "الحرم" : "المطار"))

  const steps: MissionStep[] = [
    {
      type: "context",
      title: "Take a taxi back to the hotel",
      body: "You leave the Haram tired. The driver is waiting. Say the destination clearly, then listen.",
      scene: "taxi",
    },
    {
      type: "phrase",
      prompt: `Tell the driver: I want ${destEn}, please.`,
      tokens: shuffle(ctx.rand, [wantWord, destWord, pleaseWord, otherDests[0] ?? arabicOf("how-much")]),
      correctOrder: [wantWord, destWord, pleaseWord],
    },
    {
      type: "listen",
      prompt: "The driver asks which way.",
      arabic: arabicOf(dir),
      audioId: dir,
      options: [
        { id: dir, label: dir === "right" ? "Right" : "Left" },
        { id: "other", label: dir === "right" ? "Left" : "Right" },
        { id: "far", label: "It is far" },
      ],
      correctId: dir,
    },
    {
      type: "decision",
      prompt: complicationCopy.prompt,
      situation: complicationCopy.situation,
      options: [
        { id: "stop", label: "Stop here, please", arabic: stopPhrase },
        { id: "price", label: "How much?", arabic: arabicOf("how-much") },
        { id: "far", label: "It is far", arabic: arabicOf("far") },
      ],
      correctId: "stop",
      feedback: "Stop here, please — what you need when the route changes.",
    },
  ]

  return {
    id: `taxi-${dest}-${dir}`,
    missionId: "taxi-hotel",
    seed: "",
    selectedVocabularyIds: vocabIds,
    selectedComplicationId: complication,
    variables: { destination: dest, direction: dir },
    steps,
    outcome: `You reached ${destEn}.`,
  }
}

export function buildDinner(ctx: MissionBuildContext): MissionRun {
  const chickens = pick(ctx.rand, [1, 2])
  const waters = pick(ctx.rand, [1, 2, 3])
  const extra = pick(ctx.rand, ["plain", "no-sugar", "extra-bread"])
  const vocabIds = uniqueIds(["i-want", "chicken", "rice", "water", "please", "the-bill", "n1", "n2", "n3", "without"])

  const extraLine =
    extra === "no-sugar" ? "Tea without sugar." : extra === "extra-bread" ? "Extra bread." : "Rice with the chicken."

  const steps: MissionStep[] = [
    {
      type: "context",
      title: "Order dinner",
      body: `You sit down hungry. Order ${chickens} chicken meal${chickens > 1 ? "s" : ""} and ${waters} water${waters > 1 ? "s" : ""}. ${extraLine}`,
      scene: "restaurant",
    },
    {
      type: "discover",
      prompt: "The table already taught you some of this. Use it to ask.",
      vocabIds: ["i-want", "chicken", "rice", "water", "please"],
    },
    {
      type: "choice",
      prompt: "How do you start the order?",
      options: [
        { id: "msa", label: "I want… (formal)", arabic: "أريد" },
        { id: "saudi", label: "I want… (Saudi everyday)", arabic: "أبغى" },
        { id: "where", label: "Where is the gate?", arabic: "أين الباب؟" },
      ],
      correctId: "msa",
      feedback: "Both أريد and أبغى work. أريد is broadly understood; أبغى is common locally.",
    },
    {
      type: "phrase",
      prompt: "Ask for chicken.",
      tokens: shuffle(ctx.rand, ["أريد", "دجاج"]),
      correctOrder: ["أريد", "دجاج"],
    },
    {
      type: "choice",
      prompt: "Water: hot or cold?",
      options: [
        { id: "cold", label: "Cold", arabic: "بارد" },
        { id: "hot", label: "Hot", arabic: "حار" },
        { id: "closed", label: "Closed", arabic: "مغلق" },
      ],
      correctId: "cold",
    },
    {
      type: "decision",
      prompt: "You are finished eating.",
      situation: extra === "no-sugar" ? "You also asked for tea without sugar." : "Time for the bill.",
      options: [
        { id: "bill", label: "The bill, please", arabic: "الحساب، لو سمحت" },
        { id: "gate", label: "Where is Safa?", arabic: "أين الصفا؟" },
        { id: "lost", label: "I am lost", arabic: "أنا ضايع" },
      ],
      correctId: "bill",
    },
  ]

  return {
    id: `dinner-${chickens}-${waters}-${extra}`,
    missionId: "order-dinner",
    seed: "",
    selectedVocabularyIds: vocabIds,
    variables: { chickens, waters, extra },
    steps,
    outcome: `You ordered ${chickens} chicken and ${waters} water.`,
  }
}

export function buildNumbers(_ctx: MissionBuildContext): MissionRun {
  const oneToTen = ["n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n10"] as const
  const ordinals = ["first", "second", "third"] as const
  const elevenToTwenty = [
    "n11",
    "n12",
    "n13",
    "n14",
    "n15",
    "n16",
    "n17",
    "n18",
    "n19",
    "n20",
  ] as const
  const vocabIds = uniqueIds([...oneToTen, ...ordinals, ...elevenToTwenty])
  const steps: MissionStep[] = [
    {
      type: "study",
      groups: [
        {
          title: "1–10",
      copyKey: "1-10",
          scene: "numbers",
          vocabIds: [...oneToTen],
        },
        {
          title: "First, second, third",
      copyKey: "first-second-third",
          vocabIds: [...ordinals],
        },
        {
          title: "11–20",
      copyKey: "11-20",
          vocabIds: [...elevenToTwenty],
        },
      ],
    },
  ]

  return {
    id: "numbers-everywhere-study",
    missionId: "numbers-everywhere",
    seed: "",
    selectedVocabularyIds: vocabIds,
    variables: {},
    steps,
    outcome: "You studied numbers 1–20 and first, second, third.",
  }
}

export function buildNavigation(_ctx: MissionBuildContext): MissionRun {
  const vocabIds = uniqueIds([
    "hotel",
    "please",
    "stop-here",
    "how-much",
    "right",
    "left",
    "opposite",
    "behind",
    "signal",
    "continue-straight",
    "turn-right",
    "you-arrived",
  ])
  const steps: MissionStep[] = [
    {
      type: "study",
      groups: [
        {
          title: "In the taxi",
      copyKey: "in-the-taxi",
          intro: "A few words get you into a taxi and back to the hotel.",
          scene: "taxi",
          vocabIds: ["hotel", "please", "stop-here", "how-much"],
        },
        {
          title: "On the route",
      copyKey: "on-the-route",
          intro: "Words you hear when a driver gives directions.",
          scene: "map",
          vocabIds: ["right", "left", "continue-straight", "turn-right", "you-arrived"],
        },
        {
          title: "Around landmarks",
      copyKey: "around-landmarks",
          intro: "Useful when the route passes signals and buildings.",
          scene: "street",
          vocabIds: ["opposite", "behind", "signal"],
        },
      ],
    },
  ]

  return {
    id: "master-navigation-study",
    missionId: "master-navigation",
    seed: "",
    selectedVocabularyIds: vocabIds,
    variables: {},
    steps,
    outcome: "You studied the words for taxis and simple directions.",
  }
}

export function buildFood(_ctx: MissionBuildContext): MissionRun {
  const vocabIds = uniqueIds(["without", "with", "spicy", "cold", "hot", "juice", "vegetables", "the-bill", "plate"])
  const steps: MissionStep[] = [
    {
      type: "study",
      groups: [
        {
          title: "With and without",
      copyKey: "with-and-without",
          intro: "Customize a meal — spice, sugar, and what to leave out.",
          scene: "food",
          vocabIds: ["without", "with", "spicy", "hot", "cold"],
        },
        {
          title: "More on the table",
      copyKey: "more-on-the-table",
          intro: "Juice, vegetables, and plates when ordering for a group.",
          scene: "restaurant",
          vocabIds: ["juice", "vegetables", "plate"],
        },
        {
          title: "Closing the meal",
      copyKey: "closing-the-meal",
          intro: "Ask for the bill when you are done.",
          scene: "restaurant",
          vocabIds: ["the-bill"],
        },
      ],
    },
  ]

  return {
    id: "explore-food-study",
    missionId: "explore-food",
    seed: "",
    selectedVocabularyIds: vocabIds,
    variables: {},
    steps,
    outcome: "You studied with / without, spice, juice, and ordering for a group.",
  }
}

function shuffle<T>(rand: () => number, items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}
