import { ExternalLink, FileText, Globe, Play } from "lucide-react"
import { studyResourcesAreMock } from "@/data/learning/study-resources"
import type { StudyResource, StudyResourceKind } from "@/lib/learning-types"

const iconFor: Record<StudyResourceKind, typeof Globe> = {
  website: Globe,
  youtube: Play,
  pdf: FileText,
}

const labelFor: Record<StudyResourceKind, string> = {
  website: "Website",
  youtube: "YouTube",
  pdf: "PDF",
}

function youtubeEmbedSrc(item: StudyResource) {
  if (item.youtubeVideoId) {
    return `https://www.youtube-nocookie.com/embed/${item.youtubeVideoId}`
  }
  if (item.youtubePlaylistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${item.youtubePlaylistId}`
  }
  return null
}

function YouTubeEmbed({ item }: { item: StudyResource }) {
  const src = youtubeEmbedSrc(item)
  if (!src) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-sky/25 bg-black">
      <div className="aspect-video w-full">
        <iframe
          src={src}
          title={item.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="border-t border-sky/20 bg-sky/5 px-4 py-3">
        <p className="font-medium leading-snug text-ink">{item.title}</p>
        <p className="mt-0.5 text-xs text-sky-deep">{item.source}</p>
        {item.note ? <p className="mt-1 text-xs text-muted-foreground">{item.note}</p> : null}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-sky-deep hover:underline"
        >
          Open on YouTube
          <ExternalLink className="size-3" aria-hidden />
        </a>
      </div>
    </div>
  )
}

export function StudyResources({ items }: { items: StudyResource[] }) {
  if (!items.length) return null

  const embedVideo = items.find((item) => item.kind === "youtube" && youtubeEmbedSrc(item))
  const links = embedVideo ? items.filter((item) => item !== embedVideo) : items

  return (
    <section className="space-y-3">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-deep uppercase">
          Keep practicing
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          External sources to go deeper after this study session.
        </p>
        {studyResourcesAreMock ? (
          <p className="mt-2 rounded-2xl border border-gold-soft/80 bg-gold-soft/35 px-3 py-2 text-xs leading-relaxed text-ink-soft">
            Mock data for now — links and videos are placeholders until we curate
            mission-specific resources.
          </p>
        ) : null}
      </div>

      {embedVideo ? <YouTubeEmbed item={embedVideo} /> : null}

      {links.length ? (
        <ul className="space-y-2">
          {links.map((item) => {
            const Icon = iconFor[item.kind]
            return (
              <li key={item.url}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 rounded-2xl border border-sky/25 bg-sky/5 px-4 py-3 transition hover:border-sky/40 hover:bg-sky/10"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky/15 text-sky-deep">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-medium leading-snug text-ink">{item.title}</span>
                      <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-ink-soft" aria-hidden />
                    </span>
                    <span className="mt-0.5 block text-xs text-sky-deep">{item.source}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.note ?? labelFor[item.kind]}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}
