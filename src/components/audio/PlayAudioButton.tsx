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
  disabled = false,
}: {
  packId: string
  clipId: string
  autoPlay?: boolean
  size?: "icon" | "default" | "inline" | "zone"
  variant?: "secondary" | "terracotta" | "outline" | "ghost"
  className?: string
  label?: string
  disabled?: boolean
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

  if (size === "inline") {
    return (
      <Button
        type="button"
        size="icon"
        variant={playing ? "terracotta" : variant}
        className={cn("size-7 shrink-0 rounded-full", className)}
        aria-label={label ?? "Play pronunciation"}
        disabled={disabled}
        onClick={() => void play(clipId)}
      >
        <Volume2 className="size-3.5" />
      </Button>
    )
  }

  if (size === "zone") {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-label={label ?? "Play pronunciation"}
        className={cn(
          "flex min-w-14 shrink-0 items-center justify-center self-stretch border-r border-border/60 bg-secondary/45 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60",
          playing && "bg-terracotta/15 text-terracotta",
          className,
        )}
        onClick={() => void play(clipId)}
      >
        <Volume2 className={cn("size-4", playing && "animate-pulse")} />
      </button>
    )
  }

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
