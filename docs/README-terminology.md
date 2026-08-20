# Product terminology

**This is the glossary.** Use these names in UI copy, About text, features, and new code. Do not invent product words to match old files.

The app teaches Arabic through journeys. The map is a speaking path. Study is a word library. Rites live in Trip companion, not on the language path.

**Near-term scope:** fully flesh out **Arabic for Umrah**. Hajj, everyday travel, and Quranic Arabic are shown as **coming soon** (onboarding, About, Profile → switch journey). Do not add playable maps or missions for those until Umrah is solid.

---

## Canonical names

| Say | Means | Example |
| --- | --- | --- |
| **Journey** | One language path | Arabic for Umrah (playable). Hajj, Everyday, Quranic — coming soon |
| **Map** | Home. The path of places for the active journey | Umrah stamps |
| **Chapter** | A stretch of the map | Arrival, Makkah, Madinah |
| **Mission** | A speaking stop on the **spine** | Taxi, Gate, Tawaf |
| **Side mission** | A speaking stop **off** the spine. Does not block the next mission | Dinner, Lost?, Help |
| **Study** | The word-library tab. Optional. Not a map stop | Lists under Numbers, Hotel, Food |
| **Topic** | A folder of lists inside Study | Numbers, Navigation |
| **Lesson** | One list inside a topic | Numbers Basic |
| **Skill** | What the learner can do, on Progress | Navigation, Food |
| **Skill depth** | How far that skill has gone | Basic, Advanced, Master |
| **Trip companion** | Rites and trip notes. Not Arabic study | Umrah rites outline |

Do not use **core**, **adventure** (as a type), **prep**, **toolkit**, **guide** (as a tab), **session** (as a lesson name), **scenario**, or **spline**.

The spine is the main chain of missions. Side missions connect to it; they are not Study.

---

## How the pieces nest

```
Journey  (Arabic for Umrah)     ← the only playable journey
  Map
    Chapter  (Arrival)
      Mission        Taxi
      Mission        Airport
    Chapter  (Makkah)
      Mission        Gate
      Side mission   Dinner
      Mission        Enter
  Study  (tab)
    Topic    Numbers
      Lesson   Numbers - Basic
      Lesson   Numbers - Advanced
  Trip companion  (tab)
    Rites reference — not a mission

Coming soon (Profile / onboarding only — no map yet)
  Arabic for Hajj
  Arabic for Real Life
  Quranic Arabic
```

Progress is stored per journey. Only Umrah is released, so the home map is always Umrah.

The tab bar says **Trip**. About and the companion header say **Trip companion**.

---

## Do not confuse these

**Map side mission ≠ Study lesson.** Dinner is a side mission (a place on the map). Numbers Basic is a lesson (a list in Study).

- Map places: `MissionNode` `kind: "mission" | "side"` + playable `Mission` in `missions.ts`
- Lessons: type `Lesson` in `lessons.ts`. Complete with `completeMission({ kind: "lesson" })` → `completedLessonIds`

Map completions use `kind: "mission"` → `completedMissionIds`.

**Chapter ≠ Journey.** Arrival is a chapter. Umrah is a journey. Chapter ids: `arrival`, `makkah`, `madinah`.

**Study ≠ Trip companion.** Study is words. Trip companion is rites.

---

## Code map

| Product | Type / id | Catalog | Route | UI strings |
| --- | --- | --- | --- | --- |
| Journey | `JourneyCategory` | `src/data/journeys.ts` | Profile → switch | `locales.*.journeys` |
| Map | `MissionGraph` | `mission-graph.ts` (`umrahGraph`) | `/` | `ui.map`, `ui.missions` |
| Chapter | `Chapter` (`graph.chapters`) | same graph | labels on the map | `locales.*.chapters` |
| Mission | `kind: "mission"` + `Mission` | `missions.ts` | `/missions/:id` then `/play/:id` | `ui.mission`, `missionDetails` |
| Side mission | `kind: "side"` + `Mission` | same | same | same |
| Study | tab id `study` | — | `/study` | `ui.nav.study`, `ui.study` |
| Topic | `Topic` / `TopicId` | `topics.ts` | `/study` | `ui.study.topics` |
| Lesson | `Lesson` | `lessons.ts` | `/lessons/:id` | `ui.play`, titles from `levelName` |
| Skill | `CapabilityId` | `capabilities.ts` | `/progress` | `locales.*.capabilities` |
| Skill depth | `1 \| 2 \| 3` | `depthLabel()` | Progress | `ui.depth` |
| Trip companion | tab id `companion` | `companion.ts` | `/companion` | `ui.nav.trip`, `ui.companion` |

Graph kinds: `"mission" | "side"`. Play kinds: `"mission" | "lesson"`.

`isJourneyReleased` is Umrah only. Other journey cards open a coming-soon dialog.

Unlock:

- A **mission** opens when playable ancestors on the spine are done.
- A **side mission** does not block the spine.
- A **lesson** may list `unlockAfterMissionIds`. Optional study, not map lock.

`Mission.lessonIds` points at **lessons**. `Mission.chapterId` matches `Chapter.id`.

There are no routes for `/prep`, `/adventures`, `/side-missions`, or old scenario pages.

Progress uses `localStorage` key `arabic-experiences-state-v2`. Old keys are not read. Profile → delete data clears the current blob.

---

## Copy rules

- A map stamp is a **mission** or **side mission**, never an adventure or a lesson.
- CTA on a place: **Start mission**. CTA on a list: study / mark as done.
- Home tab: **Map** in explanations; **Home** in the tab bar is fine.
- Unreleased journeys: **Coming soon**. Do not promise playable Hajj / Everyday / Quran content.
- Progress talks about **skills** and **what you can do**, not XP.

---

## Adding a feature

**Spine mission** — `kind: "mission"` node + spine edge in `mission-graph.ts`. Same id in `missions.ts` + `builders.ts`. `playable: true` when the scene ships. Copy in `locales.*.missions` and `missionDetails`.

**Side mission** — Same, but `kind: "side"` and a `side` edge. Not in `lessons.ts`.

**Study lesson** — Row in `lessons.ts` with `topicId`, `levelName` (`Basic` / `Advanced`), and a `buildRun` from `lesson-builders.ts`. Link from a mission via `Mission.lessonIds`.

**Chapter** — `Chapter` on `umrahGraph.chapters` + `locales.*.chapters`. Set `chapterId` on each `Mission`.

**Journey** — Not until Umrah is done. Then `journeys.ts`, locale pack, `isJourneyReleased`, and a graph. Coming-soon copy already exists.

**Copy-only** — Edit `src/locales/en.ts` and `ur.ts` together.

When a map place and a lesson share a theme (Gate vs Haram Basic), they stay two objects: one speaking scene, one word list.
