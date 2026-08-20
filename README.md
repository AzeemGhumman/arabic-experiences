# Arabic Experiences

A phone-width React app that teaches Arabic **through journeys**. You speak at real stops on a map. Word lists live in Study. Rites live in Trip companion.

This is a local prototype: no backend, auth, or live AI.

**Source of truth for names and product shape:** [`docs/README-terminology.md`](docs/README-terminology.md).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What ships now

**Playable:** Arabic for Umrah — map, Study, Progress, Trip companion, Profile.

**Coming soon (copy only):** Arabic for Hajj, Arabic for Real Life, Quranic Arabic. Shown on first-run onboarding, About, and Profile → switch journey. There is no map or mission code for those yet.

**Not in the app:** restaurant/garden hotspot “scenarios,” Prep, Adventures, old `/prep` / `/adventures` URLs.

---

## How to work here

1. Read [`docs/README-terminology.md`](docs/README-terminology.md) before adding a feature or string.
2. Near-term work is **Umrah only**: finish one mission that plays well, then wire it to existing Study lessons.
3. Do not add a second journey’s map until Umrah is complete.
4. User-facing copy lives in `src/locales/en.ts` and `ur.ts` together.

### Layout

| Path | Role |
| --- | --- |
| `src/pages/` | One screen per file. Home is always the Umrah map |
| `src/components/mission/` | Map, player, GPS, scene art |
| `src/components/study/` | Study catalog, topics, word lists |
| `src/components/app-shell/` | Shell, tabs, onboarding |
| `src/data/journeys.ts` | Journey cards; `isJourneyReleased` = Umrah |
| `src/data/learning/mission-graph.ts` | Umrah map (`umrahGraph.chapters`) |
| `src/data/learning/missions.ts` | Speaking scenes |
| `src/data/learning/builders.ts` | Playable mission runs |
| `src/data/learning/lessons.ts` | Study lists |
| `src/data/learning/lesson-builders.ts` | Study lesson runs |
| `src/data/learning/topics.ts` | Study folders |
| `src/data/learning/words.ts` | Shared vocabulary |
| `src/data/companion.ts` | Trip companion (Umrah-only tab gate) |
| `src/data/umrah.ts` | Umrah rites outline for Trip companion |
| `src/lib/app-state.tsx` | React state |
| `src/lib/storage.ts` | `localStorage` key `arabic-experiences-state-v2` |

### Routes

`/`, `/missions/:id`, `/play/:id`, `/study`, `/study/bookmarks`, `/lessons/:id`, `/progress`, `/companion`, `/companion/umrah/haram`, `/profile`, `/profile/journeys`.

Unknown paths go home.

### State

Progress is per journey: `completedMissionIds`, `completedLessonIds`, skills, bookmarks. A new storage key **does not migrate** older blobs — testers start fresh. Profile can delete all data.

### Audio and images

- Audio: `npm run audio:build` — `src/data/learning/audio-packs.source.json`, clips in `public/audio/`.
- Images: [`docs/README-images.md`](docs/README-images.md) — crop with `npm run images:crop`.

### Scripts

| Command | Role |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run lint` | Oxlint |
| `npm run preview` | Serve the production build locally |
| `npm run audio:source` | Regenerate `audio-packs.source.json` from vocabulary |
| `npm run audio:generate` | Synthesize missing clips (edge-tts) |
| `npm run audio:build` | Source + generate |
| `npm run images:crop` | Split a contact sheet into webps (see images doc) |
| `npm run deploy` | Build, upload to S3, invalidate CloudFront |

### Design artifacts (`docs/`)

| File | Role |
| --- | --- |
| [`mission-dag.excalidraw`](docs/mission-dag.excalidraw) | Umrah map diagram. Regenerate: `python docs/build_mission_dag.py` |
| [`taxi-mission-pathways.excalidraw`](docs/taxi-mission-pathways.excalidraw) | Taxi mission layout sketch (reference only) |
