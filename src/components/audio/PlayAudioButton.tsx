import { useEffect, useRef } from "react"
import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudioPack } from "@/lib/audio/use-audio-pack"
import { cn } from "@/lib/utils"

export function PlayAudioButton({
  packId,
  clipId,
  autoPlay = false,
  size = "icon",
  variant = "secondary",
  className,
  label,
}: {
  packId: string
  clipId: string
  autoPlay?: boolean
  size?: "icon" | "default"
  variant?: "secondary" | "terracotta" | "outline" | "ghost"
  className?: string
  label?: string
}) {
  const { play, playingId } = useAudioPack(packId)
  const playing = playingId === clipId
  const autoPlayed = useRef(false)

  useEffect(() => {
    autoPlayed.current = false
  }, [clipId, packId])

  useEffect(() => {
    if (!autoPlay || autoPlayed.current) return
    autoPlayed.current = true
    void play(clipId)
  }, [autoPlay, clipId, packId, play])

  if (size === "default") {
    return (
      <Button
        type="button"
        variant={playing ? "terracotta" : variant}
        className={cn("w-full", className)}
        aria-label={label ?? "Play audio"}
        onClick={() => void play(clipId)}
      >
        <Volume2 />
        {playing ? "Playing…" : label ?? "Listen"}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size="icon"
      variant={playing ? "terracotta" : variant}
      className={className}
      aria-label={label ?? "Play pronunciation"}
      onClick={() => void play(clipId)}
    >
      <Volume2 className="size-4" />
    </Button>
  )
}
