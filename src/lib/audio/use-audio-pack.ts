import { useCallback, useEffect, useRef, useState } from "react"
import { hasClip, playClip, prefetchAudioPack } from "@/lib/audio/service"

export function useAudioPack(packId: string) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const activeRef = useRef<string | null>(null)

  useEffect(() => {
    void prefetchAudioPack(packId)
  }, [packId])

  const play = useCallback(
    async (clipId: string) => {
      activeRef.current = clipId
      setPlayingId(clipId)
      const ok = await playClip(packId, clipId)
      if (activeRef.current === clipId) {
        setPlayingId(null)
        activeRef.current = null
      }
      return ok
    },
    [packId],
  )

  const clipAvailable = useCallback((clipId: string) => hasClip(packId, clipId), [packId])

  return { packId, play, playingId, clipAvailable }
}
