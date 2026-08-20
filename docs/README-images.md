# Image resources

Hand-off for agents: generate still images the same way Study topic thumbs were built. Treat this like the audio pipeline — **one locked style, a source file, skip or replace files on disk, ship a manifest**.

Audio analog:

| Audio | Images |
| --- | --- |
| Voice `ar-SA-HamedNeural` | Style bible below |
| `src/data/learning/audio-packs.source.json` | `src/data/learning/images.source.json` |
| `scripts/generate_audio.py` (skip existing) | Generate a **2×2 contact sheet**, then crop |
| `public/audio/` + `manifest.json` | `public/images/` + `manifest.json` |

Do not invent a new look per batch. Copy the prompt boilerplate. Do not jump to 3×3 grids.

---

## Style bible (do not improvise)

**Look:** flat travel gouache, calm Umrah companion, one object or place per square.

**Palette (use these hex codes in the prompt):**

| Role | Hex |
| --- | --- |
| Cream ground | `#f7f1e8` |
| Ink | `#3a2f26` |
| Terracotta | `#c4785a` |
| Sage | `#6e8b74` |
| Gold | `#c4a35a` |
| Dusty sky | `#7ba8b8` |

**Rules:**

- Square icon, subject large and centered, generous inner margin (must read at ~52px).
- No text, letters, logos, watermarks, UI chrome.
- No photorealism, no 3D render, no cute cartoon, no busy backgrounds.
- No photoreal faces. Faceless simple figures only if the subject needs people.
- Sacred places: distant, simple, respectful. Kaaba = small black cube + gold band. Nabawi = one sage-green dome. No crowds, no tourist photography.
- Modest still lifes for ihram, barber, body, family.

If a new image does not match existing thumbs in `public/images/study/`, regenerate that sheet. Consistency beats novelty.

---

## Why 2×2 sheets

One generation, four tiles — cheaper than four calls.

- **2×2 only.** 3×3 and larger usually bleed across cells.
- Tile order is **row-major, left to right, top to bottom:**
  1. top-left
  2. top-right
  3. bottom-left
  4. bottom-right
- That order **must** match `tiles[]` in `images.source.json`.
- Count of `tiles` must be 4. If you only need two subjects, still generate four panels (fillers allowed) and **do not wire filler ids** into the app.

---

## Files

| Path | Role |
| --- | --- |
| `src/data/learning/images.source.json` | Style string, 2×2 grid, per-sheet subjects, `kind` |
| `src/data/learning/topic-images.ts` | Maps `TopicId` → `/images/study/{id}.webp` |
| `src/data/learning/mission-images.ts` | Maps mission id → `/images/missions/{id}.webp` |
| `src/components/study/TopicPicture.tsx` | Study thumb: webp if mapped, else SVG |
| `src/components/mission/ExperienceScenes.tsx` | `SceneMark` / non-interactive scenes use mission webps |
| `scripts/crop_image_sheet.py` | Splits a sheet into 512px webps, updates the public manifest |
| `public/images/sheets/{sheetId}.png` | Saved contact sheets |
| `public/images/study/{topicId}.webp` | Study topic thumbs |
| `public/images/missions/{missionId}.webp` | Map stamps and mission thumbs |
| `public/images/manifest.json` | Inventory by kind (`study`, `missions`) |

Each sheet in source has `"kind": "study"` or `"kind": "missions"`. Crop writes to `public/images/{kind}/` and merges that key in the manifest.

Current Study coverage: **all 25 `TopicId`s** have webps. Current mission coverage: **all 13 mission ids** have webps. SVG art remains as fallback when an id is missing from the map.

---

## Workflow: add or replace images

### 1. Record the sheet in source

Edit `src/data/learning/images.source.json`. Add or replace a sheet:

```json
{
  "id": "mission-arrival",
  "kind": "missions",
  "tiles": [
    { "id": "taxi-hotel", "subject": "gold Saudi taxi sedan parked beside a cream hotel doorway with a terracotta awning, no people" },
    { "id": "airport-arrival", "subject": "cream luggage carousel with one brown suitcase, dusty-blue arrivals hall, no people" },
    { "id": "immigration", "subject": "closed cream passport and a terracotta ink pad on a simple wooden desk, no text, no numerals" },
    { "id": "find-haram", "subject": "cream pointed arch gate with a terracotta lantern hanging in the opening, dusty sky, no crowds" }
  ]
}
```

`kind` is `study` or `missions`. Tile `id` should be the `TopicId` or mission id (or a throwaway filler like `lantern-alt` that you will not map in TypeScript).

### 2. Generate one 1:1 contact sheet

Use Cursor **GenerateImage**:

- `aspect_ratio`: `"1:1"`
- `filename`: `study-sheet-{sheetId}.png` or `mission-sheet-{id}.png` (examples: `study-sheet-city.png`, `mission-sheet-arrival.png`)
- `description`: **boilerplate + four panel lines** (template below)

The tool writes something like:

`/Users/azeem/.cursor/projects/Users-azeem-workspace-code-personal-arabic/assets/study-sheet-{sheetId}.png`

Copy it into the repo using the source sheet id:

```bash
cp /Users/azeem/.cursor/projects/Users-azeem-workspace-code-personal-arabic/assets/mission-sheet-arrival.png \
  public/images/sheets/mission-arrival.png
```

Inspect the sheet. If tiles spilled, subjects swapped, or style drifted, **regenerate the whole sheet** before cropping.

### 3. Crop

Pillow lives in `.venv-audio` after the first image batch (`pip install pillow` there if missing).

```bash
cd arabic-experiences
.venv-audio/bin/python scripts/crop_image_sheet.py public/images/sheets/city.png --sheet-id city
```

This:

- Insets each cell by `gutterInset` (0.04) to drop cream gutters
- Writes `public/images/{kind}/{tileId}.webp` at 512×512 (`study` or `missions`)
- Merges paths into `public/images/manifest.json` under that kind

**Skip existing:** crop always overwrites those four webps. To keep a good tile, do not recrop that sheet, or copy the good webp aside first.

### 4. Wire the UI

Study: add entries in `src/data/learning/topic-images.ts`. `TopicPicture` reads that map.

```ts
hotel: "/images/study/hotel.webp",
```

Missions: add entries in `src/data/learning/mission-images.ts`. Pass `missionId` into `SceneMark` / `ExperienceScene`. Interactive gameplay scenes stay SVG.

```ts
"taxi-hotel": "/images/missions/taxi-hotel.webp",
```

Delete filler files (`*-alt.webp`) if they are not real ids. Do not add them to the TypeScript maps.

### 5. Check in the product

Open **Study**. Thumbs are ~52px rounded squares. Open the **map** for mission stamps (~56px circles). Zoom one webp if a subject looks empty or cropped.

---

## Prompt boilerplate (copy exactly, then fill four panels)

Use this as `description` for GenerateImage. Keep the palette, gutters, and “independent square icon” language.

```
A perfect 2x2 contact sheet of four separate square illustration panels, two on top and two on bottom. Thick even cream gutters (#f7f1e8) between panels. No text, letters, watermarks, or logos.

Shared style: flat travel gouache, calm Umrah-journey app, palette cream #f7f1e8, ink #3a2f26, terracotta #c4785a, sage #6e8b74, gold #c4a35a, dusty sky #7ba8b8. Soft lighting, simple shapes, one centered object per panel, generous inner margin. Not photoreal, not 3D, not cute cartoon, no photoreal faces.

Top-left: {subject 1}
Top-right: {subject 2}
Bottom-left: {subject 3}
Bottom-right: {subject 4}

Each panel is an independent square icon with sharp edges. Even 2x2 filling the whole image.
```

Paste subjects from `images.source.json` so the prompt and the crop map cannot drift.

For worship sheets, add: `no crowds, respectful, distant`. For Kaaba / green dome, keep the object small in the courtyard.

---

## Existing sheets

Study (`kind: "study"`):

| Sheet id | Tiles (TL, TR, BL, BR) |
| --- | --- |
| `arrive` | packing, airport, transport, navigation |
| `city` | hotel, room-service, money, food |
| `market` | shopping, colors, clothes, time |
| `people` | polite, family, health, body |
| `worship` | haram, ritual, nabawi, barber |
| `words` | numbers, geography, actions, adjectives |
| `outdoors` | nature, tents-alt, nature-alt, bus-alt (only `nature` is wired) |

Missions (`kind: "missions"`):

| Sheet id | Tiles (TL, TR, BL, BR) |
| --- | --- |
| `mission-arrival` | immigration, airport-arrival, taxi-hotel, find-haram |
| `mission-haram` | enter-haram, begin-tawaf, find-zamzam, complete-sai |
| `mission-city` | order-dinner, lost-group, something-wrong, barber |
| `mission-beyond` | day-madinah, tents-alt, lantern-alt, basin-alt (only `day-madinah` is wired) |

---

## Regenerating one topic

You cannot recrop a single cell without the sheet. To replace `airport`:

1. Keep the same `arrive` `tiles[]` order.
2. Generate a new `study-sheet-arrive.png` with the same four subjects (tweak only the weak panel’s sentence).
3. Copy over `public/images/sheets/arrive.png` and recrop `--sheet-id arrive`.
4. All four webps in that sheet are overwritten.

If three tiles were good, copy those webps aside, recrop, then restore the three keepers.

---

## Next image kinds (same rules)

When adding word pictures:

1. New folder under `public/images/` (e.g. `public/images/words/`).
2. New key in `manifest.json` (do not dump everything into `study` or `missions`).
3. Still **2×2 + style bible + source JSON**.
4. Do not auto-image every vocab row until a scene truly needs it.

Interactive mission play art stays SVG. Do not replace direction-hit scenes with these square stamps.

---

## Agent checklist

- [ ] Subjects live in `images.source.json` before generating, with the right `kind`
- [ ] Prompt uses the boilerplate and the four hex colors
- [ ] `aspect_ratio` is `1:1`; four panels; no 3×3
- [ ] Sheet copied to `public/images/sheets/{id}.png`
- [ ] Cropped with `--sheet-id` matching source
- [ ] Real topic ids added to `topic-images.ts`; real mission ids to `mission-images.ts`
- [ ] Fillers not mapped; unused webps deleted
- [ ] Looked at thumbs in Study (~52px) or map stamps (~56px) at real size
