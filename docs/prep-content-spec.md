# Prep content spec — Arabic for Umrah

Structured content specification for the **Prep** catalog (`PrepTopic` → `SideMission` → study `buildRun`).

**Audience:** content authors and implementers.  
**Code targets:** `prep-topics.ts`, `side-missions.ts`, `pools.ts`, `words.ts`, `builders.ts`, `ExperienceScenes.tsx`, `learning-types.ts`.

**Status key:** `implemented` · `stub` (metadata only) · `planned`

---

## 1. Design rules

| Rule | Spec enforcement |
|------|------------------|
| Situations first | Every session links to ≥1 `adventureId` or a journey chapter |
| Core → More | Level 1 = **Basic** (8–15 words, ~4–5 min); Level 2 = **More** (12–20 words, ~5–7 min) |
| Reuse words | Reference existing `wordId`s; add new words only in §5 |
| Language-only ritual | Ritual lists teach **words**, not rulings |
| Register mix | Mark MSA vs Saudi colloquial on new words; pair `أريد`/`أبغى`, `أين`/`وين`, `كم`/`بكم` where useful |
| Creative grouping | Each session uses 2–4 `StudyGroup`s with `title`, optional `intro`, optional `scene` |
| Study-only prep | All prep runs are a single `study` step (see existing `buildNumbers`) |

---

## 2. Schema mapping

### 2.1 PrepTopic

```ts
type PrepTopic = {
  id: PrepTopicId
  title: string        // catalog heading, e.g. "Money"
  description: string  // one-line learner pitch
  order: number        // catalog sort (lower = earlier)
}
```

### 2.2 SideMission (prep session)

```ts
type SideMission = {
  id: string                    // kebab-case, globally unique
  title: string                 // "{Topic} - {LevelName}" via prepTitle()
  topicId: PrepTopicId
  level: number                 // 1 = Basic, 2 = More, 3 = Deep (optional)
  levelName: string             // "Basic" | "More" | "Deep"
  description: string           // card subtitle
  adventureIds: string[]        // adventures this prep supports
  unlockAfterAdventureIds: string[]  // empty = always visible in catalog
  vocabularyGain: number
  estimatedMinutes: number
  capabilityId: CapabilityId
  capabilityLevel: number       // usually matches level
  playable: boolean
  canNowDo: string              // competence line after Done
  buildRun?: (ctx) => AdventureRun
}
```

### 2.3 Study step (inside buildRun)

```ts
{
  type: "study",
  groups: StudyGroup[]
}

type StudyGroup = {
  title: string
  intro?: string
  scene?: AdventureScene
  vocabIds: string[]   // ordered; must exist in words.ts
}
```

### 2.4 Presentation hint (future UI — not in types yet)

Optional field for authors; implement when building rich layouts:

```ts
type PrepPresentation =
  | "vocab-list"      // default StudyVocabList (current)
  | "checklist"       // packing, medicine pouch
  | "diagram"         // family tree, body outline, floor plan
  | "compare-pairs"   // adjectives, colors on objects
  | "market-grid"     // shopping stalls
  | "timeline"        // time, Hajj days
  | "sort-buckets"    // actions by category
```

---

## 3. Type extensions required

### 3.1 PrepTopicId (proposed)

```ts
export type PrepTopicId =
  // implemented / stub
  | "numbers" | "navigation" | "food" | "colors"
  // Tier 1 — next build
  | "money" | "hotel" | "haram" | "polite" | "packing"
  // Tier 2
  | "barber" | "shopping" | "health" | "nabawi" | "ritual" | "time"
  // Tier 3
  | "clothes" | "body" | "family" | "adjectives" | "geography" | "nature" | "actions"
  | "transport" | "airport" | "room-service"
  // Tier 4 — Hajj branch
  | "hajj"
```

### 3.2 AdventureScene additions (proposed)

Existing scenes: `street`, `haram-gate`, `crowd`, `taxi`, `restaurant`, `map`, `numbers`, `food`, `tawaf`, `zamzam`, `sai`, `barber`, `bus`, `lost`, `madinah`, `emergency`, `airport`, `immigration`.

Add for prep study headers:

| Scene id | Used by |
|----------|---------|
| `hotel-lobby` | Hotel, room service |
| `hotel-room` | Room service |
| `market` | Shopping, clothes, money |
| `packing` | Umrah packing list |
| `pharmacy` | Health, medicine |
| `family-tree` | Family (diagram layout) |
| `body-outline` | Body parts |
| `clock` | Time |
| `haram-courtyard` | Haram vocab (wider than gate) |
| `nabawi-courtyard` | Masjid an-Nabawi |

Until art exists, fall back to nearest scene (`hotel` → `taxi` lobby aesthetic uses `street`; spec marks **fallback**).

### 3.3 CapabilityId

No change needed; map topics to existing capabilities (`money`, `hotel`, `haram`, `family`, `health`, `time`, etc.).

---

## 4. Vocabulary pools (new)

Append to `pools.ts`. Words listed in §5.

| Pool id | Title | capabilityId | depth |
|---------|-------|--------------|-------|
| `colors.basic` | Basic colors | navigation | 1 |
| `colors.extended` | Shades & modifiers | navigation | 2 |
| `money.deep` | Paying & haggling | money | 2 |
| `hotel.deep` | Hotel requests | hotel | 2 |
| `haram.deep` | Haram facilities | haram | 2 |
| `nabawi.basic` | Masjid an-Nabawi | haram | 1 |
| `polite.basic` | Greetings & courtesy | family | 1 |
| `packing.basic` | Umrah packing | transportation | 1 |
| `clothes.basic` | Ihram & clothing | haram | 1 |
| `shopping.basic` | Market shopping | money | 1 |
| `shopping.deep` | Sizes & souvenirs | money | 2 |
| `health.deep` | Common ailments | health | 2 |
| `body.basic` | Body parts | health | 1 |
| `time.basic` | Time & schedule | time | 1 |
| `time.deep` | Prayer-time language | time | 2 |
| `actions.movement` | Movement verbs | navigation | 1 |
| `actions.ritual` | Ritual movement | haram | 1 |
| `adjectives.basic` | Size & quality | navigation | 1 |
| `geography.basic` | Holy cities | transportation | 1 |
| `nature.basic` | Heat & comfort | health | 1 |
| `family.deep` | Extended family | family | 2 |
| `room-service.basic` | In-room requests | hotel | 1 |
| `airport.deep` | Immigration phrases | transportation | 2 |
| `ritual.deep` | Umrah stage words | haram | 2 |

---

## 5. Word registry (new words)

**Convention:** `word(id, arabic, transliteration, meaning, pools[], extra?)`

Words marked **exists** are already in `words.ts` — do not duplicate.

### 5.1 Colors (`colors.basic` / `colors.extended`)

| id | arabic | transliteration | meaning |
|----|--------|-----------------|---------|
| `color-red` | أحمر | ahmar | red |
| `color-blue` | أزرق | azraq | blue |
| `color-green` | أخضر | akhdar | green |
| `color-white` | أبيض | abyad | white |
| `color-black` | أسود | aswad | black |
| `color-yellow` | أصفر | asfar | yellow |
| `color-brown` | بني | bunni | brown |
| `color-gray` | رمادي | ramadi | gray |
| `color-light` | فاتح | faatiH | light (shade) |
| `color-dark` | غامق | ghaamiq | dark (shade) |
| `color-gold` | ذهبي | dhahabi | gold |

### 5.2 Money (`money.basic` / `money.deep`)

| id | status | meaning |
|----|--------|---------|
| `how-much` | exists | |
| `how-much-price` | exists | |
| `riyal` | exists | |
| `the-bill` | exists | |
| `please` | exists | |
| `expensive` | new | غالي — very expensive |
| `cheap` | new | رخيص — cheap |
| `cash` | new | نقد — cash |
| `card` | new | بطاقة — card |
| `this-one` | new | هذا — this (one) |
| `that-one` | new | ذاك — that (one) |
| `change-money` | new | الباقي — change (money left) |
| `how-much-saudi` | new | بكم؟ — how much? (Saudi) |
| `too-expensive` | new | غالي جداً — too expensive |

### 5.3 Hotel (`hotel.basic` / `hotel.deep` / `room-service.basic`)

| id | status | meaning |
|----|--------|---------|
| `hotel` | exists | |
| `floor` | exists | |
| `elevator` | exists | |
| `room` | new | غرفة — room |
| `room-number` | new | رقم — number (room context) |
| `key` | new | مفتاح — key |
| `bathroom` | new | حمام — bathroom |
| `bed` | new | سرير — bed |
| `ac` | new | مكيف — air conditioning |
| `towel` | new | منشفة — towel |
| `clean` | new | نظيف — clean |
| `broken` | new | معطل — broken / not working |
| `reception` | new | استقبال — reception |
| `luggage` | new | أمتعة — luggage |

### 5.4 Haram & ritual (`haram.places` / `ritual.basic` / `haram.deep`)

| id | status | meaning |
|----|--------|---------|
| `haram` | exists | |
| `kaaba` | exists | |
| `tawaf` | exists | |
| `zamzam` | exists | |
| `safa` | exists | |
| `marwah` | exists | |
| `masaa` | exists | |
| `gate` | exists | |
| `entrance` | exists | |
| `prayer` | exists | |
| `circuit` | exists | |
| `where-is` | exists | |
| `where-is-saudi` | new | وين ___؟ — where is? (Saudi) |
| `mataf` | new | المطاف — Tawaf floor |
| `courtyard` | new | ساحة — courtyard |
| `wudu` | new | وضوء — wudu |
| `ihram` | new | إحرام — ihram (state/garment) |
| `sai` | new | سعي — Sa'i |
| `talbiyah` | new | تلبية — talbiyah (word only) |
| `black-stone` | exists | |
| `drinking-area` | new | مكان الشرب — drinking area |

### 5.5 Masjid an-Nabawi (`nabawi.basic`)

| id | status | meaning |
|----|--------|---------|
| `nabawi` | exists | |
| `madinah` | exists | |
| `green-dome` | new | القبة الخضراء — Green Dome |
| `rawdah` | new | الروضة — Rawdah (word only) |
| `courtyard` | new | (shared with haram) |
| `prophet-mosque-q` | new | أين المسجد النبوي؟ — where is Masjid an-Nabawi? |

### 5.6 Polite essentials (`polite.basic`)

| id | status | meaning |
|----|--------|---------|
| `greeting` | new | السلام عليكم | assalamu alaykum |
| `greeting-response` | new | وعليكم السلام | wa alaykum assalam |
| `thank-you` | new | شكراً | thank you |
| `thank-you-much` | new | شكراً جزيلاً | thank you very much |
| `welcome` | new | عفواً | you're welcome |
| `sorry` | new | آسف | sorry (m) |
| `excuse-me` | new | عذراً | excuse me |
| `please` | exists | |
| `dont-understand` | new | لا أفهم | I don't understand |
| `yes` | new | نعم | yes |
| `no` | new | لا | no |
| `peace-praise` | new | الحمد لله | praise be to God |

### 5.7 Umrah packing (`packing.basic`)

| id | arabic hint | meaning |
|----|-------------|---------|
| `passport` | exists | |
| `visa` | new | تأشيرة — visa |
| `ihram` | new | (shared) |
| `sandals` | new | نعال — sandals |
| `belt-bag` | new | حقيبة خصر — waist bag |
| `sunscreen` | new | واقي شمس — sunscreen |
| `medicine` | new | دواء — medicine |
| `charger` | new | شاحن — charger |
| `toothbrush` | new | فرشاة أسنان — toothbrush |
| `towel` | new | (shared hotel) |
| `umbrella` | new | مظلة — umbrella |
| `snacks` | new | وجبات خفيفة — snacks |
| `copy-passport` | new | نسخة جواز — passport copy |

### 5.8 Clothes (`clothes.basic`)

| id | meaning |
|----|---------|
| `ihram` | (shared) |
| `sandals` | (shared) |
| `abaya` | new — عباءة |
| `headscarf` | new — حجاب / طرحة |
| `size` | new — مقاس — size |
| `big` | new — كبير — big |
| `small` | new — صغير — small |
| `try-on` | new — أجرب — I'll try (it) |
| `laundry` | new — مغسلة — laundry |

### 5.9 Shopping (`shopping.basic` / `shopping.deep`)

| id | meaning |
|----|---------|
| `how-much-saudi` | (shared) |
| `this-one` / `that-one` | (shared) |
| `dates` | new — تمر — dates |
| `perfume` | new — عطر — perfume |
| `souvenir` | new — تذكار — souvenir |
| `prayer-beads` | new — سبحة — prayer beads |
| `size` | (shared) |
| `expensive` / `cheap` | (shared) |
| `market` | new — سوق — market |
| `shop` | new — محل — shop |

### 5.10 Health & body

**Body (`body.basic`):** `head`, `hand`, `foot`, `stomach`, `back`, `throat`, `eye`, `ear`, `chest`, `leg` — all **new**.

**Health (`health.basic` exists partially):** `sick`, `pharmacy`, `doctor`, `it-hurts` exist. Add: `medicine`, `allergy`, `fever`, `tired`, `water` (exists).

### 5.11 Time (`time.basic` / `time.deep`)

| id | meaning |
|----|---------|
| `now` | new — الآن |
| `today` | new — اليوم |
| `tomorrow` | new — غداً |
| `hour` | new — ساعة |
| `minute` | new — دقيقة |
| `morning` | new — صباح |
| `evening` | new — مساء |
| `after` | new — بعد |
| `before` | new — قبل |
| `when` | new — متى — when? |
| `half-hour` | new — نصف ساعة |
| `how-many-minutes` | exists | |

### 5.12 Adjectives (`adjectives.basic`)

Reuse where possible: `big`, `small`, `clean`, `hot`, `cold`, `new` (new), `old` (new), `heavy` (new), `light-weight` (new), `near`, `far` (exist).

### 5.13 Geography & nature

**Geography:** `makkah`, `madinah`, `airport` exist. Add: `jeddah`, `saudi-arabia`, `holy-land`.

**Nature:** `hot`, `water` exist. Add: `sun`, `shade`, `sand`, `wind`, `tired`, ` thirsty` (new — عطشان).

### 5.14 Family extended (`family.deep`)

| id | meaning |
|----|---------|
| `my-husband` … `my-daughter` | exist |
| `father` | new — أب |
| `mother` | new — أم |
| `brother` | new — أخ |
| `sister` | new — أخت |
| `son` | new — ابن (without possessive) |
| `daughter` | new — ابنة |
| `grandfather` | new — جد |
| `uncle` | new — عم / خال |

### 5.15 Actions (`actions.movement` / `actions.ritual` / `commands.basic`)

Most movement verbs **exist**: `walk`, `wait`, `stop`, `enter`, `exit-cmd`, `come`, `go-back`, `start`, `finished`.

Add ritual-adjacent (language only): `circumambulate` → use `tawaf`; `run-sai` → new `sai-verb` (سعى / perform Sa'i).

### 5.16 Hajj (`hajj.places` — exists)

`mina`, `arafat`, `muzdalifah`, `jamarat`, `bus`, `camp`, `seat` exist. Add: `throw-stones` (word only), `day-of-arafah`, `tent`.

---

## 6. Topics catalog

| order | topicId | title | sessions |
|------:|---------|-------|----------|
| 1 | numbers | Numbers | Basic ✓ · More (11–100) · Deep optional |
| 2 | polite | Polite essentials | Basic · More |
| 3 | packing | Umrah packing | Basic · More |
| 4 | navigation | Navigation | Basic ✓ · GPS · Signs |
| 5 | transport | Transportation | Basic · More |
| 6 | airport | Airport & arrival | Basic · More |
| 7 | geography | Holy cities | Basic |
| 8 | hotel | Hotel | Basic · More |
| 9 | room-service | Room service | Basic |
| 10 | money | Money & prices | Basic · More |
| 11 | food | Food | Basic ✓ · More |
| 12 | shopping | Shopping | Basic · More |
| 13 | colors | Colors | Basic stub · More stub |
| 14 | clothes | Clothes & ihram | Basic · More |
| 15 | time | Time | Basic · More |
| 16 | family | Family | Basic · More |
| 17 | haram | Masjid al-Haram | Basic · More |
| 18 | ritual | Umrah actions | Basic · More |
| 19 | nabawi | Masjid an-Nabawi | Basic · More |
| 20 | barber | Barber | Basic · More |
| 21 | health | Medicine & health | Basic · More |
| 22 | body | Body parts | Basic |
| 23 | emergency | Emergency | Basic (may merge with adventures) |
| 24 | actions | Actions | Basic (by category) |
| 25 | adjectives | Adjectives | Basic |
| 26 | nature | Heat & comfort | Basic |
| 27 | hajj | Hajj | Basic · More |

---

## 7. Session specifications

Each block is copy-ready metadata + study groups.

---

### 7.1 Numbers — `numbers-everywhere` · **implemented**

```yaml
id: numbers-everywhere
topicId: numbers
level: 1
levelName: Basic
status: implemented
capabilityId: numbers
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 23
adventureIds: [airport-arrival, taxi-hotel, find-haram, enter-haram, begin-tawaf, complete-sai, order-dinner, hajj-bus]
unlockAfterAdventureIds: [find-haram, order-dinner, enter-haram, taxi-hotel]
canNowDo: "Recognize numbers 1–20 and first, second, third."
presentation: vocab-list
builder: buildNumbers

groups:
  - title: "1–10"
    scene: numbers
    vocabIds: [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10]
  - title: "First, second, third"
    vocabIds: [first, second, third]
  - title: "11–20"
    vocabIds: [n11, n12, n13, n14, n15, n16, n17, n18, n19, n20]
```

---

### 7.2 Numbers — `numbers-to-100` · **planned**

```yaml
id: numbers-to-100
topicId: numbers
level: 2
levelName: More
status: planned
capabilityId: numbers
capabilityLevel: 3
estimatedMinutes: 6
vocabularyGain: 18
adventureIds: [hajj-bus, taxi-hotel, order-dinner]
unlockAfterAdventureIds: [numbers-everywhere]
canNowDo: "Read bus numbers, prices, and room numbers up to 100."
presentation: price-tags
builder: buildNumbersTo100

groups:
  - title: "Tens"
    intro: "Bus lines, prices, and room floors use these constantly."
    scene: bus
    vocabIds: [n20, n30, n40, n50, n60, n70, n80, n90, n100]  # new words
  - title: "Combining"
    intro: "21 = twenty + one. Listen for the pattern."
    scene: numbers
    vocabIds: [n21, n35, n48, n72, n99]  # exemplar compounds, new
  - title: "On signs"
    intro: "Gate numbers and camp numbers."
    scene: haram-gate
    vocabIds: [number, gate, camp, room-number]
```

---

### 7.3 Navigation — `master-navigation` · **implemented**

```yaml
id: master-navigation
status: implemented
# (see side-missions.ts — groups: In the taxi / On the route / Around landmarks)
```

---

### 7.4 Navigation — `navigation-gps` · **planned**

```yaml
id: navigation-gps
topicId: navigation
level: 2
levelName: More
status: planned
capabilityId: navigation
capabilityLevel: 3
estimatedMinutes: 6
vocabularyGain: 14
adventureIds: [taxi-hotel, find-haram]
unlockAfterAdventureIds: [master-navigation]
canNowDo: "Follow GPS-style turn-by-turn Arabic."
presentation: vocab-list
builder: buildNavigationGps

groups:
  - title: "Turn-by-turn"
    scene: map
    vocabIds: [turn-right, turn-left, continue-straight, after-meters, you-arrived, second-left]
  - title: "Landmarks"
    scene: street
    vocabIds: [signal, bridge, intersection, opposite, behind]
```

---

### 7.5 Food — `explore-food` · **implemented**

```yaml
id: explore-food
status: implemented
```

---

### 7.6 Food — `food-menu` · **planned**

```yaml
id: food-menu
topicId: food
level: 2
levelName: More
status: planned
capabilityId: food
capabilityLevel: 3
estimatedMinutes: 6
vocabularyGain: 16
adventureIds: [order-dinner, find-zamzam]
unlockAfterAdventureIds: [explore-food]
canNowDo: "Name common dishes and table items when ordering for a group."
presentation: market-grid

groups:
  - title: "Main dishes"
    scene: food
    vocabIds: [chicken, meat, rice, bread, vegetables, fruit]
  - title: "Drinks"
    scene: restaurant
    vocabIds: [water, water-saudi, tea, coffee, juice]
  - title: "Tableware"
    vocabIds: [plate, cup, spoon, fork]
  - title: "How much"
    vocabIds: [i-want, i-want-saudi, please, the-bill]
```

---

### 7.7 Colors — `colors-basic` · **stub**

```yaml
id: colors-basic
topicId: colors
level: 1
levelName: Basic
status: stub → planned
capabilityId: navigation
capabilityLevel: 1
estimatedMinutes: 4
vocabularyGain: 10
adventureIds: [taxi-hotel, find-haram]
unlockAfterAdventureIds: []
canNowDo: "Name basic colors on signs, clothes, and bags."
presentation: compare-pairs
builder: buildColorsBasic

groups:
  - title: "On the road"
    intro: "Signs, taxi colors, and abaya colors."
    scene: street
    vocabIds: [color-red, color-green, color-white, color-black, color-yellow]
  - title: "More common colors"
    vocabIds: [color-blue, color-brown, color-gray]
```

---

### 7.8 Colors — `colors-extended` · **stub**

```yaml
id: colors-extended
topicId: colors
level: 2
levelName: More
status: stub → planned
unlockAfterAdventureIds: [colors-basic]
presentation: compare-pairs
builder: buildColorsExtended

groups:
  - title: "Light and dark"
    intro: "Describe shades when shopping."
    scene: market
    vocabIds: [color-light, color-dark, color-gold, color-white, color-black]
  - title: "Describe something"
    intro: "Light blue bag, dark green sign."
    vocabIds: [color-blue, color-green, color-brown, color-gray, color-red]
```

---

### 7.9 Polite essentials — `polite-basic` · **planned** (Tier 1)

```yaml
id: polite-basic
topicId: polite
level: 1
levelName: Basic
status: planned
capabilityId: family
capabilityLevel: 1
estimatedMinutes: 4
vocabularyGain: 12
adventureIds: [airport-arrival, find-haram, enter-haram, order-dinner, taxi-hotel, lost-group]
unlockAfterAdventureIds: []
canNowDo: "Greet people, say please and thank you, and ask for clarification."
presentation: timeline  # vertical conversation spine

groups:
  - title: "Opening a conversation"
    intro: "You will hear this dozens of times a day."
    scene: crowd
    vocabIds: [greeting, greeting-response, peace-praise]
  - title: "Courtesy"
    vocabIds: [please, thank-you, thank-you-much, welcome, sorry, excuse-me]
  - title: "When you get stuck"
    vocabIds: [dont-understand, yes, no]
```

---

### 7.10 Umrah packing — `packing-basic` · **planned** (Tier 1)

```yaml
id: packing-basic
topicId: packing
level: 1
levelName: Basic
status: planned
capabilityId: transportation
capabilityLevel: 1
estimatedMinutes: 5
vocabularyGain: 14
adventureIds: [airport-arrival, immigration]
unlockAfterAdventureIds: []
canNowDo: "Name essentials in your bag and documents you carry."
presentation: checklist

groups:
  - title: "Documents & money"
    scene: airport
    vocabIds: [passport, visa, copy-passport, riyal, card]
  - title: "Ihram & wear"
    scene: packing
    vocabIds: [ihram, sandals, belt-bag, abaya, headscarf]
  - title: "Health & comfort"
    vocabIds: [medicine, sunscreen, towel, toothbrush, charger, umbrella, snacks]
```

---

### 7.11 Money & prices — `money-basic` · **planned** (Tier 1)

```yaml
id: money-basic
topicId: money
level: 1
levelName: Basic
status: planned
capabilityId: money
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 12
adventureIds: [order-dinner, barber, taxi-hotel]
unlockAfterAdventureIds: [order-dinner]
canNowDo: "Ask how much something costs and ask for the bill."
presentation: price-tags

groups:
  - title: "Asking the price"
    scene: market
    vocabIds: [how-much, how-much-price, how-much-saudi, riyal, this-one, that-one]
  - title: "Reacting"
    vocabIds: [expensive, cheap, too-expensive]
  - title: "Paying"
    vocabIds: [cash, card, the-bill, please, change-money]
```

---

### 7.12 Hotel — `hotel-basic` · **planned** (Tier 1)

```yaml
id: hotel-basic
topicId: hotel
level: 1
levelName: Basic
status: planned
capabilityId: hotel
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 14
adventureIds: [taxi-hotel, lost-group]
unlockAfterAdventureIds: [taxi-hotel]
canNowDo: "Find your room, use the elevator, and name basic hotel places."
presentation: diagram  # floor plan

groups:
  - title: "Finding your room"
    intro: "The reception desk and elevator."
    scene: hotel-lobby  # fallback: street
    vocabIds: [hotel, reception, room, room-number, floor, elevator, key]
  - title: "In the room"
    scene: hotel-room  # fallback: restaurant
    vocabIds: [bathroom, bed, ac, luggage]
  - title: "Asking"
    vocabIds: [where-is, please, here, there]
```

---

### 7.13 Masjid al-Haram — `haram-basic` · **planned** (Tier 1)

```yaml
id: haram-basic
topicId: haram
level: 1
levelName: Basic
status: planned
capabilityId: haram
capabilityLevel: 2
estimatedMinutes: 6
vocabularyGain: 16
adventureIds: [find-haram, enter-haram, begin-tawaf, find-zamzam, complete-sai]
unlockAfterAdventureIds: [find-haram]
canNowDo: "Name key places inside Masjid al-Haram and ask where they are."
presentation: diagram  # courtyard hotspots

groups:
  - title: "The building"
    scene: haram-courtyard  # fallback: tawaf
    vocabIds: [haram, kaaba, mataf, courtyard, gate, entrance]
  - title: "Ritual places"
    intro: "Words you hear — not a fiqh lesson."
    scene: tawaf
    vocabIds: [tawaf, circuit, black-stone, safa, marwah, masaa, sai]
  - title: "Finding things"
    scene: zamzam
    vocabIds: [zamzam, water, cup, drinking-area, where-is, where-is-saudi]
```

---

### 7.14 Masjid al-Haram — `haram-more` · **planned**

```yaml
id: haram-more
topicId: haram
level: 2
levelName: More
status: planned
unlockAfterAdventureIds: [haram-basic]
builder: buildHaramMore

groups:
  - title: "Crowd instructions"
    scene: crowd
    vocabIds: [walk, wait, stop, enter, exit-cmd, men, women, families]
  - title: "Prayer & wudu"
    vocabIds: [prayer, rakah, wudu, open, closed, prohibited]
  - title: "Floors & directions"
    vocabIds: [up, down, floor, this-way, near, far]
```

---

### 7.15 Umrah ritual actions — `ritual-basic` · **planned**

```yaml
id: ritual-basic
topicId: ritual
level: 1
levelName: Basic
status: planned
capabilityId: haram
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 12
adventureIds: [begin-tawaf, complete-sai]
unlockAfterAdventureIds: [begin-tawaf]
canNowDo: "Recognize words for Umrah stages and common movement instructions."
presentation: timeline

groups:
  - title: "Stages"
    intro: "One word per stage — language only."
    scene: tawaf
    vocabIds: [ihram, tawaf, sai, talbiyah, wudu, prayer]
  - title: "Movement"
    scene: sai
    vocabIds: [walk, start, finished, go-back, circuit, faster]
  - title: "States"
    vocabIds: [open, closed, wait, enter, prohibited]
```

---

### 7.16 Masjid an-Nabawi — `nabawi-basic` · **planned**

```yaml
id: nabawi-basic
topicId: nabawi
level: 1
levelName: Basic
status: planned
capabilityId: haram
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 10
adventureIds: [day-madinah]
unlockAfterAdventureIds: []
canNowDo: "Ask for Masjid an-Nabawi and recognize key place names in Madinah."
presentation: diagram

groups:
  - title: "The mosque"
    scene: nabawi-courtyard  # fallback: madinah
    vocabIds: [nabawi, madinah, green-dome, courtyard, gate, entrance]
  - title: "Asking the way"
    vocabIds: [prophet-mosque-q, where-is, where-is-saudi, near, far]
  - title: "Inside"
    intro: "Word recognition only."
    vocabIds: [rawdah, prayer, wudu, men, women]
```

---

### 7.17 Barber — `barber-basic` · **planned**

```yaml
id: barber-basic
topicId: barber
level: 1
levelName: Basic
status: planned
capabilityId: haram
capabilityLevel: 2
estimatedMinutes: 4
vocabularyGain: 10
adventureIds: [barber]
unlockAfterAdventureIds: [barber]
canNowDo: "Ask for a full shave or a trim and say only a little."
presentation: compare-pairs  # shave vs trim silhouette

groups:
  - title: "What you want"
    scene: barber
    vocabIds: [shave, trim, complete-cut, hair, clippers, a-little, only]
  - title: "Paying"
    vocabIds: [how-much, how-much-saudi, please, the-bill]
```

---

### 7.18 Shopping — `shopping-basic` · **planned**

```yaml
id: shopping-basic
topicId: shopping
level: 1
levelName: Basic
status: planned
capabilityId: money
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 14
adventureIds: [order-dinner]
unlockAfterAdventureIds: [order-dinner]
canNowDo: "Buy dates, perfume, and souvenirs with basic price questions."
presentation: market-grid

groups:
  - title: "At the stall"
    scene: market
    vocabIds: [market, shop, this-one, that-one, how-much, how-much-saudi]
  - title: "Umrah souvenirs"
    vocabIds: [dates, perfume, prayer-beads, souvenir, ihram]
  - title: "Size & price"
    vocabIds: [size, big, small, expensive, cheap]
```

---

### 7.19 Medicine & health — `health-basic` · **planned**

```yaml
id: health-basic
topicId: health
level: 1
levelName: Basic
status: planned
capabilityId: health
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 12
adventureIds: [something-wrong]
unlockAfterAdventureIds: [something-wrong]
canNowDo: "Say you feel sick, find a pharmacy, and ask for medicine."
presentation: checklist

groups:
  - title: "How you feel"
    scene: emergency
    vocabIds: [sick, tired, it-hurts, fever, thirsty]
  - title: "Getting help"
    vocabIds: [pharmacy, doctor, hospital, help, help-me]
  - title: "Medicine"
    scene: pharmacy
    vocabIds: [medicine, water, allergy]
```

---

### 7.20 Body parts — `body-basic` · **planned**

```yaml
id: body-basic
topicId: body
level: 1
levelName: Basic
status: planned
capabilityId: health
capabilityLevel: 1
estimatedMinutes: 4
vocabularyGain: 10
adventureIds: [barber, something-wrong]
unlockAfterAdventureIds: []
canNowDo: "Point to where it hurts and name basic body parts."
presentation: diagram  # body-outline

groups:
  - title: "Head & face"
    vocabIds: [head, hair, eye, ear, throat]
  - title: "Torso & limbs"
    vocabIds: [hand, chest, stomach, back, foot, leg]
  - title: "It hurts here"
    vocabIds: [it-hurts, here, doctor, pharmacy]
```

---

### 7.21 Family — `family-basic` · **planned**

```yaml
id: family-basic
topicId: family
level: 1
levelName: Basic
status: planned
capabilityId: family
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 12
adventureIds: [lost-group]
unlockAfterAdventureIds: [lost-group]
canNowDo: "Say who you are looking for when separated from your group."
presentation: diagram  # family-tree

groups:
  - title: "Your group"
    scene: lost
    vocabIds: [my-family, my-group, my-husband, my-wife, my-son, my-daughter]
  - title: "Looking for someone"
    vocabIds: [looking-for, child, phone, gate, hotel]
  - title: "If you are lost"
    vocabIds: [i-am-lost-m, i-am-lost-f, help-me, where-is]
```

---

### 7.22 Family — `family-more` · **planned**

```yaml
id: family-more
topicId: family
level: 2
levelName: More
status: planned
presentation: diagram

groups:
  - title: "Close family"
    vocabIds: [father, mother, brother, sister, son, daughter]
  - title: "Extended"
    vocabIds: [grandfather, uncle, children, families]
  - title: "Describing your group"
    vocabIds: [my-family, my-group, with, here, there]
```

---

### 7.23 Time — `time-basic` · **planned**

```yaml
id: time-basic
topicId: time
level: 1
levelName: Basic
status: planned
capabilityId: time
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 12
adventureIds: [hajj-bus, taxi-hotel]
unlockAfterAdventureIds: []
canNowDo: "Understand now, today, tomorrow, and simple wait times."
presentation: timeline

groups:
  - title: "Right now"
    scene: clock
    vocabIds: [now, today, tomorrow, when]
  - title: "How long"
    vocabIds: [hour, minute, half-hour, how-many-minutes, after, before]
  - title: "Day parts"
    vocabIds: [morning, evening, wait]
```

---

### 7.24 Clothes & ihram — `clothes-basic` · **planned**

```yaml
id: clothes-basic
topicId: clothes
level: 1
levelName: Basic
status: planned
capabilityId: haram
capabilityLevel: 1
estimatedMinutes: 4
vocabularyGain: 10
adventureIds: [airport-arrival]
unlockAfterAdventureIds: []
canNowDo: "Name ihram, sandals, and ask for a size when buying clothes."
presentation: compare-pairs

groups:
  - title: "Ihram & footwear"
    scene: market
    vocabIds: [ihram, sandals, belt-bag, abaya, headscarf]
  - title: "Shopping for fit"
    vocabIds: [size, big, small, try-on, how-much-saudi]
  - title: "Care"
    vocabIds: [laundry, clean, towel]
```

---

### 7.25 Actions — `actions-basic` · **planned**

```yaml
id: actions-basic
topicId: actions
level: 1
levelName: Basic
status: planned
capabilityId: navigation
capabilityLevel: 2
estimatedMinutes: 5
vocabularyGain: 14
adventureIds: [enter-haram, complete-sai, taxi-hotel]
unlockAfterAdventureIds: [enter-haram]
canNowDo: "Sort common instructions into movement, waiting, and permission."
presentation: sort-buckets

groups:
  - title: "Movement"
    intro: "Tap the bucket: Move."
    scene: crowd
    vocabIds: [walk, come, enter, exit-cmd, go-back, faster]
  - title: "Waiting & stopping"
    vocabIds: [wait, stop, start, finished]
  - title: "Permission & signs"
    vocabIds: [prohibited, open, closed, this-way, toward]
```

---

### 7.26 Adjectives — `adjectives-basic` · **planned**

```yaml
id: adjectives-basic
topicId: adjectives
level: 1
levelName: Basic
status: planned
capabilityId: navigation
capabilityLevel: 1
estimatedMinutes: 4
vocabularyGain: 10
adventureIds: [taxi-hotel, order-dinner]
unlockAfterAdventureIds: []
canNowDo: "Describe size, temperature, and condition when shopping or at the hotel."
presentation: compare-pairs

groups:
  - title: "Size"
    vocabIds: [big, small, heavy, light-weight]
  - title: "Condition"
    vocabIds: [new, old, clean, broken]
  - title: "Comfort"
    vocabIds: [hot, cold, near, far, tired]
```

---

### 7.27 Geography — `geography-basic` · **planned**

```yaml
id: geography-basic
topicId: geography
level: 1
levelName: Basic
status: planned
capabilityId: transportation
capabilityLevel: 1
estimatedMinutes: 4
vocabularyGain: 8
adventureIds: [taxi-hotel, hajj-bus, day-madinah]
unlockAfterAdventureIds: []
canNowDo: "Name Makkah, Madinah, Jeddah, and the airport on a simple map."
presentation: diagram

groups:
  - title: "Holy cities"
    scene: map
    vocabIds: [makkah, madinah, jeddah, holy-land]
  - title: "Arrival"
    scene: airport
    vocabIds: [airport, taxi, bus, toward]
```

---

### 7.28 Nature & heat — `nature-basic` · **planned**

```yaml
id: nature-basic
topicId: nature
level: 1
levelName: Basic
status: planned
capabilityId: health
capabilityLevel: 1
estimatedMinutes: 4
vocabularyGain: 8
adventureIds: [hajj-bus, something-wrong]
unlockAfterAdventureIds: []
canNowDo: "Ask for water and shade when waiting outdoors."
presentation: compare-pairs

groups:
  - title: "Outdoors"
    vocabIds: [sun, hot, sand, wind, shade]
  - title: "How you feel"
    vocabIds: [tired, thirsty, water, water-saudi, please]
```

---

### 7.29 Room service — `room-service-basic` · **planned**

```yaml
id: room-service-basic
topicId: room-service
level: 1
levelName: Basic
status: planned
capabilityId: hotel
capabilityLevel: 2
estimatedMinutes: 4
vocabularyGain: 10
adventureIds: [taxi-hotel]
unlockAfterAdventureIds: [hotel-basic]
canNowDo: "Request towels, report a broken AC, and ask to clean the room."
presentation: diagram  # room cutaway

groups:
  - title: "Requests"
    scene: hotel-room
    vocabIds: [towel, clean, please, i-want, i-want-saudi]
  - title: "Problems"
    vocabIds: [broken, ac, bathroom, help, help-me]
  - title: "Delivery words"
    vocabIds: [here, there, room, floor]
```

---

### 7.30 Hajj — `hajj-places-basic` · **planned** (Tier 4)

```yaml
id: hajj-places-basic
topicId: hajj
level: 1
levelName: Basic
status: planned
capabilityId: hajj-locations
capabilityLevel: 2
estimatedMinutes: 6
vocabularyGain: 14
adventureIds: [hajj-bus]
unlockAfterAdventureIds: [hajj-bus]
canNowDo: "Name Mina, Arafat, Muzdalifah, and Jamarat on a day-by-day map."
presentation: timeline

groups:
  - title: "Places"
    scene: bus
    vocabIds: [mina, arafat, muzdalifah, jamarat, makkah, camp, tent]
  - title: "Transport"
    vocabIds: [bus, seat, station, number, wait]
  - title: "Words you hear"
    intro: "Language only — not a fiqh lesson."
    vocabIds: [throw-stones, day-of-arafah, walk, stop]
```

---

## 8. Adventure ↔ prep matrix

| Adventure | Recommended prep sessions |
|-----------|---------------------------|
| `immigration` | packing-basic, polite-basic, airport-more |
| `airport-arrival` | packing-basic, polite-basic, numbers-everywhere, transport-basic |
| `taxi-hotel` | master-navigation, numbers-everywhere, hotel-basic, money-basic, polite-basic, geography-basic |
| `find-haram` | master-navigation, numbers-everywhere, haram-basic, polite-basic |
| `enter-haram` | haram-more, actions-basic, polite-basic |
| `begin-tawaf` | numbers-everywhere, haram-basic, ritual-basic |
| `find-zamzam` | explore-food, haram-basic |
| `complete-sai` | numbers-everywhere, ritual-basic, actions-basic |
| `order-dinner` | explore-food, numbers-everywhere, money-basic, food-menu |
| `barber` | barber-basic, money-basic, body-basic |
| `lost-group` | family-basic, polite-basic, hotel-basic, master-navigation |
| `something-wrong` | health-basic, body-basic, polite-basic, emergency |
| `day-madinah` | nabawi-basic, geography-basic, polite-basic |
| `hajj-bus` | numbers-to-100, hajj-places-basic, geography-basic, time-basic |

---

## 9. Implementation phases

### Phase A — Types & registry (no UI)
1. Extend `PrepTopicId` and `prepTopics` (§6).
2. Add pools (§4) and new words (§5) to `words.ts` / `pools.ts`.
3. Add scene ids to `AdventureScene` + placeholder art in `ExperienceScenes.tsx`.

### Phase B — Tier 1 sessions (5 builders)
Implement in order:
1. `polite-basic`
2. `money-basic`
3. `hotel-basic`
4. `haram-basic`
5. `packing-basic`

Register in `side-missions.ts`, release in `mission-graph.ts`, add `build*` in `builders.ts`.

### Phase C — Stub completion
6. `colors-basic` / `colors-extended` (words + builders)
7. `food-menu`, `navigation-gps`

### Phase D — Tier 2 (situation depth)
8. `barber-basic`, `shopping-basic`, `health-basic`, `nabawi-basic`, `ritual-basic`, `time-basic`

### Phase E — Confidence builders
9. `family-basic`, `body-basic`, `clothes-basic`, `actions-basic`, `adjectives-basic`, `geography-basic`, `nature-basic`, `room-service-basic`

### Phase F — Hajj branch
10. `hajj-places-basic`, `numbers-to-100`

### Phase G — Creative presentation (optional)
Wire `PrepPresentation` hints to alternate study layouts (checklist, diagram, sort-buckets).

---

## 10. Authoring checklist (per session)

- [ ] All `vocabIds` exist in `words.ts` with audio clip ids (`packId` = session id)
- [ ] 2–4 groups; ≤8 words per group for readability
- [ ] `adventureIds` populated; unlock rule intentional (empty = always in catalog)
- [ ] `canNowDo` is one concrete competence, not "learned vocabulary"
- [ ] Saudi variants included where pilgrims actually hear them
- [ ] Ritual content reviewed: **language recognition only**
- [ ] `mission-graph.ts` release flag set when ready
- [ ] i18n: topic title/description in `locales/en.ts` + `ur.ts` under `prep.topics.{topicId}`

---

## 11. Cross-reference: current codebase

| Item | Location |
|------|----------|
| Live prep sessions | `src/data/learning/side-missions.ts` |
| Study builders | `src/data/learning/builders.ts` → `buildNumbers`, `buildNavigation`, `buildFood` |
| Word data | `src/data/learning/words.ts` (~179 words) |
| Pools | `src/data/learning/pools.ts` (22 pools) |
| Scenes | `src/components/adventure/ExperienceScenes.tsx` |
| Study UI | `src/components/adventure/StudyVocabList.tsx` |
| Bookmarks | `src/data/learning/prep-study.ts` |

---

*Last updated: 2026-08-18 — aligns with prep bookmarks, StudyVocabList, and Tier 1 research recommendations.*
