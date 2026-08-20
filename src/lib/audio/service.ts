import type { AudioManifest } from "@/lib/audio/types"

const MANIFEST_URL = "/audio/manifest.json"

let manifestPromise: Promise<AudioManifest | null> | null = null
let manifestCache: AudioManifest | null = null
const audioCache = new Map<string, HTMLAudioElement>()
const prefetching = new Set<string>()

/** Currently playing element — enforces single-audio-at-a-time globally. */
let activeAudio: HTMLAudioElement | null = null
let playbackGeneration = 0

function clipKey(packId: string, clipId: string) {
  return `${packId}:${clipId}`
}

async function loadManifest(): Promise<AudioManifest | null> {
  if (manifestCache) return manifestCache
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((data: AudioManifest | null) => {
        manifestCache = data
        return data
      })
  }
  return manifestPromise
}

export async function getClipMeta(packId: string, clipId: string) {
  const manifest = await loadManifest()
  return manifest?.packs[packId]?.clips[clipId]
}

export async function hasClip(packId: string, clipId: string) {
  return Boolean(await getClipMeta(packId, clipId))
}

function getAudioElement(packId: string, clipId: string, src: string) {
  const key = clipKey(packId, clipId)
  const existing = audioCache.get(key)
  if (existing) return existing
  const audio = new Audio(src)
  audio.preload = "auto"
  audioCache.set(key, audio)
  return audio
}

export async function prefetchAudioPack(packId: string) {
  if (prefetching.has(packId)) return
  prefetching.add(packId)
  const manifest = await loadManifest()
  const pack = manifest?.packs[packId]
  if (!pack) return
  for (const [id, clip] of Object.entries(pack.clips)) {
    getAudioElement(packId, id, clip.src)
  }
}

/** Stop whatever is currently playing globally. */
export function stopAll() {
  playbackGeneration += 1
  if (activeAudio) {
    activeAudio.pause()
    activeAudio.currentTime = 0
    activeAudio = null
  }
}

export async function playClip(packId: string, clipId: string): Promise<boolean> {
  stopAll()
  const meta = await getClipMeta(packId, clipId)
  if (!meta) return false
  const audio = getAudioElement(packId, clipId, meta.src)
  audio.currentTime = 0
  const generation = playbackGeneration
  activeAudio = audio
  try {
    await audio.play()
    await new Promise<void>((resolve) => {
      const cleanup = () => {
        audio.removeEventListener("ended", onEnd)
        audio.removeEventListener("pause", onPause)
      }
      const onEnd = () => {
        cleanup()
        resolve()
      }
      const onPause = () => {
        cleanup()
        resolve()
      }
      audio.addEventListener("ended", onEnd)
      audio.addEventListener("pause", onPause)
    })
    if (generation === playbackGeneration && activeAudio === audio) activeAudio = null
    return generation === playbackGeneration
  } catch {
    if (generation === playbackGeneration && activeAudio === audio) activeAudio = null
    return false
  }
}

export function stopClip(packId: string, clipId: string) {
  const audio = audioCache.get(clipKey(packId, clipId))
  if (!audio) return
  audio.pause()
  audio.currentTime = 0
  if (activeAudio === audio) activeAudio = null
}

export function isPlaying() {
  return activeAudio !== null && !activeAudio.paused
}
