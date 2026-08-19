# Arabic Experiences

A mobile-first static prototype for an interactive Muslim journey and Arabic learning app. It combines Umrah and Hajj companions with practical Arabic missions and Quranic vocabulary scenes.

This is a product-exploration prototype: no backend, auth, payments, or live AI. All content is local mock data.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What you can walk through

- Home, journey library, and bottom navigation
- Umrah journey map and the **Entering Masjid al-Haram** experience
- Hajj placeholder path
- Arabic missions, including **Order at a Restaurant**
- Quranic vocabulary garden scene
- Word detail, progress, profile, and first-run onboarding

Religious text is clearly labeled as prototype content. Quran lemma counts come from the Quranic Arabic Corpus via Wiktionary, not a new scholarly tally.

---

## Developer notes

### 1. Component architecture

The app is a Vite + React + TypeScript SPA with React Router and a phone-width shell.

- `src/components/app-shell/` — layout, bottom nav, onboarding
- `src/components/journey/` — journey cards, map, nodes, illustrations
- `src/components/scene/` — hotspots, mission/context cards, CSS/SVG scenes
- `src/components/vocabulary/` — progressive word reveal and supplication card
- `src/components/progress/` — rings and snapshots
- `src/components/ui/` — shadcn-style primitives (button, card, dialog, switch, …)
- `src/pages/` — one file per screen
- `src/lexicon/` — merged scene lexicon (`words.json`, rebuilt from `dataset/`)
- `src/lib/app-state.tsx` — React state persisted to `localStorage`

Shared visual pieces to reuse: `JourneyIllustration`, `SceneCard`, `InteractiveHotspot`, `VocabularyReveal`, `ProgressRing`, `JourneyNode`, `SupplicationCard`, `ContextCard`, `MissionCard`.

### 2. Where mock data lives

| File | Contents |
| --- | --- |
| `src/data/journeys.ts` | The four primary journeys |
| `src/data/umrah.ts` | Umrah steps, Haram experience copy, Hajj placeholders |
| `src/data/scenarios.ts` | Arabic missions, restaurant/garden hotspots |
| `src/data/vocabulary.ts` | Scene words and related IDs |
| `src/lexicon/words.json` | IPA, Quran lemma counts, MSA rank, travel phrases |
| `dataset/` | Public source lists; not shown as a word bank |

Types live in `src/lib/storage.ts`.

### 3. How to add a new journey

1. Add a `Journey` object in `src/data/journeys.ts`.
2. Add a page under `src/pages/` and a route in `src/App.tsx` (`/journeys/<id>`).
3. Give it a `JourneyIllustration` category (or extend the illustration map).
4. Link it from Home / Journeys with `JourneyCard`.

Keep the same interaction language: enter an experience, do not open a lesson list.

### 4. How to add a new interactive scene

1. Describe hotspots in `src/data/scenarios.ts` (`x` / `y` percents on the scene).
2. Add or reuse vocabulary rows in `src/data/vocabulary.ts`, then run `npm run lexicon`.
3. Draw a low-fidelity scene in `src/components/scene/Scenes.tsx` (SVG/CSS is enough).
4. Copy the restaurant or garden page pattern: scene + `InteractiveHotspot` + `VocabularyReveal`.
5. Register the route and a `SceneCard` on the parent journey page.

### 5. Later: AI, speech, and real religious content

- **Speech:** `VocabularyReveal` and the Listen buttons already mock playback. Replace the timeout with Web Audio / TTS / a recorded clip. Recognition can sit behind the restaurant “Say …” buttons.
- **AI:** Keep scenes and missions data-driven. A later API can generate hotspot copy, adaptive hints, or “you already know this” detection without changing the shell.
- **Religious content:** Do not silently replace placeholders. Swap `src/data/umrah.ts` with scholar-reviewed sources. Quran frequencies in the lexicon are corpus lemma counts; keep the on-screen attribution until a reviewed recount exists.

Prototype state is intentionally small: discovered words, confidence, completed steps, language preference, transliteration/translation toggles, adventure completions, and domain capabilities. There is no XP. Progress copy should stay about what the user can now do.

### 6. Adventure learning system

This is the pilgrimage Arabic engine added on top of the original scenes.

| Path | Role |
| --- | --- |
| `src/data/learning/words.ts` | Normalized reusable vocabulary |
| `src/data/learning/pools.ts` | Pools such as `navigation.basic` |
| `src/data/learning/adventures.ts` | Core adventure catalog |
| `src/data/learning/side-missions.ts` | Optional depth missions |
| `src/data/learning/builders.ts` | Step sequences and variants |
| `src/lib/adventure-engine.ts` | `createRunById` — seed, pools, capability-aware taxi |
| `src/components/adventure/` | Player, cards, GPS map |

**Add an adventure:** define it in `adventures.ts`, add a `buildRun` in `builders.ts`, set `playable: true`.

**Add a side mission:** define it in `side-missions.ts`, unlock it from `sideMissionIds` on a core adventure, add a builder.

**Capabilities:** stored in `localStorage` as `state.capabilities`. Completing a core adventure sets level 1. Completing Master Navigation / Numbers / Food sets level 2.

**Adaptive selection:** `buildTaxi` in `builders.ts` checks `capabilities.navigation >= 2` and switches to GPS-style instructions. That is the demo of side missions changing a later adventure.

### 7. Audio and images

- **Audio:** `npm run audio:build` — source in `src/data/learning/audio-packs.source.json`, clips in `public/audio/`.
- **Images:** 2×2 contact sheets, cropped to webp. Full agent workflow is in [`docs/README-images.md`](docs/README-images.md). Give that file to a new chat before generating more art.

