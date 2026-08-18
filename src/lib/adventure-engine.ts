import type { Adventure, AdventureBuildContext, AdventureRun, LearningWord } from "@/lib/learning-types"
import { getLearningWord, wordsInPool } from "@/data/learning/words"
import { getAdventure } from "@/data/learning/adventures"
import { getSideMission } from "@/data/learning/side-missions"

export function createSeed() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

export function rngFromSeed(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  }
  let t = h >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function pickFromPool(rand: () => number, poolId: string, count: number, preferDeep: boolean): LearningWord[] {
  const pool = wordsInPool(poolId)
  const ranked = [...pool].sort((a, b) => {
    if (preferDeep) return b.difficulty - a.difficulty
    return a.difficulty - b.difficulty
  })
  const chosen: LearningWord[] = []
  const used = new Set<string>()
  for (const word of ranked) {
    if (chosen.length >= count) break
    if (used.has(word.id)) continue
    if (rand() > 0.35 || chosen.length === 0) {
      chosen.push(word)
      used.add(word.id)
    }
  }
  for (const word of ranked) {
    if (chosen.length >= count) break
    if (!used.has(word.id)) {
      chosen.push(word)
      used.add(word.id)
    }
  }
  return chosen
}

function makeContext(seed: string, capabilities: Record<string, number>): AdventureBuildContext {
  const rand = rngFromSeed(seed)
  return {
    rand,
    capabilities,
    pickFromPool: (poolId, count) => pickFromPool(rand, poolId, count, (capabilities.navigation ?? 0) >= 2),
    word: (id) => {
      const item = getLearningWord(id)
      if (!item) throw new Error(`Unknown learning word: ${id}`)
      return item
    },
  }
}

export function createAdventureRun(
  adventure: Adventure,
  capabilities: Record<string, number>,
  seed = createSeed(),
): AdventureRun {
  if (!adventure.buildRun) {
    throw new Error(`${adventure.id} is not playable yet`)
  }
  const run = adventure.buildRun(makeContext(seed, capabilities))
  return { ...run, seed, adventureId: adventure.id }
}

export function createRunById(
  id: string,
  capabilities: Record<string, number>,
  seed?: string,
): { kind: "adventure" | "side"; run: AdventureRun; title: string; canNowDo: string; sideMissionIds: string[] } {
  const adventure = getAdventure(id)
  if (adventure?.playable && adventure.buildRun) {
    return {
      kind: "adventure",
      run: createAdventureRun(adventure, capabilities, seed),
      title: adventure.title,
      canNowDo: adventure.canNowDo,
      sideMissionIds: adventure.sideMissionIds,
    }
  }
  const side = getSideMission(id)
  if (side?.playable && side.buildRun) {
    const run = side.buildRun(makeContext(seed ?? createSeed(), capabilities))
    return {
      kind: "side",
      run: { ...run, seed: seed ?? run.id, adventureId: side.id },
      title: side.title,
      canNowDo: side.canNowDo,
      sideMissionIds: [],
    }
  }
  throw new Error(`No playable experience: ${id}`)
}
