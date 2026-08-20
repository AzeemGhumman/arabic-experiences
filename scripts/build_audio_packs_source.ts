#!/usr/bin/env npx tsx
/** Regenerate audio-packs.source.json from study lessons, words, and mission builders. */

import { writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { lessons } from "../src/data/learning/lessons.ts"
import { getLearningWord } from "../src/data/learning/words.ts"
import { missions } from "../src/data/learning/missions.ts"
import { createRunById } from "../src/lib/mission-engine.ts"
import type { MissionRun } from "../src/lib/learning-types.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outPath = join(root, "src/data/learning/audio-packs.source.json")

const emptyCtx = {
  rand: () => 0.5,
  capabilities: {},
  pickFromPool: () => [],
  word: (id: string) => {
    const w = getLearningWord(id)
    if (!w) throw new Error(`Unknown word: ${id}`)
    return w
  },
}

/** Spoken form for TTS — patterns get a concrete example phrase. */
const ttsOverrides: Record<string, string> = {
  "where-is": "أين الباب؟",
  "where-is-saudi": "وين الباب؟",
  "how-much": "كم؟",
  "how-much-price": "كم السعر؟",
  "how-much-saudi": "بكم؟",
  "how-many-minutes": "كم دقيقة؟",
  "is-this-way": "هل هذا الطريق إلى الفندق؟",
  "this-way-q": "من هنا؟",
  "after-meters": "بعد مائة متر",
  "the-bill": "الحساب، لو سمحت",
  "prophet-mosque-q": "أين المسجد النبوي؟",
  "when": "متى؟",
}

function arabicForTts(wordId: string) {
  if (ttsOverrides[wordId]) return ttsOverrides[wordId]
  const word = getLearningWord(wordId)
  if (!word) return null
  return word.arabic
    .replace(/___/g, "")
    .replace(/\s+/g, " ")
    .replace(/،\s*$/, "")
    .trim()
}

type PackDef = { kind: "lesson" | "mission"; clips: Record<string, string> }

const packs: Record<string, PackDef> = {}

function addClip(packId: string, kind: PackDef["kind"], clipId: string, arabic: string | null) {
  if (!arabic) {
    console.warn(`  skip ${packId}/${clipId}: no arabic`)
    return
  }
  if (!packs[packId]) packs[packId] = { kind, clips: {} }
  packs[packId].clips[clipId] = arabic
}

function collectMissionAudio(run: MissionRun, packId: string) {
  for (const step of run.steps) {
    if (step.type === "listen" && step.audioId) {
      addClip(packId, "mission", step.audioId, step.arabic)
    }
    if (step.type === "choice" && step.audioId && step.arabic) {
      addClip(packId, "mission", step.audioId, step.arabic)
    }
    if (step.type === "phrase" && step.audioId && step.officerArabic) {
      addClip(packId, "mission", step.audioId, step.officerArabic)
    }
    if (step.type === "listen" || step.type === "choice") {
      for (const option of step.options) {
        if (option.audioId && option.arabic) {
          addClip(packId, "mission", option.audioId, option.arabic)
        }
      }
    }
    if (step.type === "gps") {
      for (const instr of step.instructions) {
        if (instr.audioId) addClip(packId, "mission", instr.audioId, instr.arabic)
      }
    }
    if (step.type === "direction" && step.arabic) {
      // direction steps use vocab id as audioId in some builders
      const word = getLearningWord(step.correct)
      if (word) addClip(packId, "mission", step.correct, word.arabic)
    }
  }
}

// Study lessons: pack id = lesson id
for (const lesson of lessons) {
  if (!lesson.buildRun) continue
  try {
    const run = lesson.buildRun(emptyCtx as never)
    run.missionId = lesson.id
    for (const step of run.steps) {
      if (step.type !== "study") continue
      for (const group of step.groups) {
        for (const id of group.vocabIds) {
          addClip(lesson.id, "lesson", id, arabicForTts(id))
        }
      }
    }
    const count = Object.keys(packs[lesson.id]?.clips ?? {}).length
    console.log(`lesson ${lesson.id}: ${count} clips`)
  } catch (err) {
    console.warn(`lesson ${lesson.id}: failed`, err)
  }
}

// Playable missions: pack id = mission id
for (const mission of missions) {
  if (!mission.playable || !mission.buildRun) continue
  try {
    const bundle = createRunById(mission.id, {}, `audio-${mission.id}`)
    collectMissionAudio(bundle.run, mission.id)
    const count = Object.keys(packs[mission.id]?.clips ?? {}).length
    if (count) console.log(`mission ${mission.id}: ${count} clips`)
  } catch (err) {
    console.warn(`mission ${mission.id}: failed`, err)
  }
}

// Preserve explicit mission phrase clips from taxi GPS builder
const taxiClips: Record<string, string> = {
  "gps-continue-straight": "استمر مباشرةً",
  "gps-second-left": "بعد مائة متر، خذ ثاني يسار",
  "gps-stop-opposite-hotel": "قف مقابل الفندق",
  "gps-arrived": "لقد وصلت إلى وجهتك",
  "decision-stop-here": "وقف هنا لو سمحت",
}
for (const [id, arabic] of Object.entries(taxiClips)) {
  addClip("taxi-hotel", "mission", id, arabic)
}

const source = {
  voice: "ar-SA-HamedNeural",
  register: "msa",
  packs,
}

writeFileSync(outPath, JSON.stringify(source, null, 2) + "\n", { encoding: "utf-8" })

const totalClips = Object.values(packs).reduce((n, p) => n + Object.keys(p.clips).length, 0)
console.log(`\nWrote ${outPath}`)
console.log(`${Object.keys(packs).length} packs, ${totalClips} clips`)
