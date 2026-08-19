import { Link } from "react-router-dom"
import { PrepDoneButton, PrepSessionRow } from "@/components/prep/PrepSessionCard"
import { PrepTopicPicture } from "@/components/prep/PrepTopicPicture"
import { prepAvailability } from "@/data/learning/availability"
import { groupPrepCatalog, type PrepCatalogTopic } from "@/data/learning/prep-catalog"
import { useI18n } from "@/lib/i18n"
import type { PrepTopic } from "@/lib/learning-types"
import { cn } from "@/lib/utils"

export function usePrepTopicCopy(topic: PrepTopic) {
  const { t } = useI18n()
  const titlePath = `prep.topics.${topic.id}.title`
  const bodyPath = `prep.topics.${topic.id}.body`
  const title = t(titlePath)
  const body = t(bodyPath)
  return {
    title: title.startsWith("prep.topics.") ? topic.title : title,
    body: body.startsWith("prep.topics.") ? topic.description : body,
  }
}

export function PrepTopicList({ catalog }: { catalog: PrepCatalogTopic[] }) {
  const { t } = useI18n()
  const shelves = groupPrepCatalog(catalog)

  return (
    <div className="space-y-6">
      {shelves.map((shelf) => {
        const title = t(`prep.shelves.${shelf.id}.title`)
        return (
          <section key={shelf.id}>
            <h2 className="px-0.5 text-[10px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
              {title}
            </h2>
            <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {shelf.topics.map((group) => (
                <PrepToolkitRow key={group.topic.id} group={group} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function PrepToolkitRow({ group }: { group: PrepCatalogTopic }) {
  const { title, body } = usePrepTopicCopy(group.topic)
  const multi = group.sessions.length > 1
  const only = group.sessions[0]
  const allDone = group.implementedCount > 0 && group.doneCount === group.implementedCount
  const comingSoon = only ? prepAvailability(only.session.id) === "coming-soon" : false
  const href =
    !multi && only && prepAvailability(only.session.id) === "open"
      ? `/side-missions/${only.session.id}?from=prep`
      : undefined

  const heading = (
    <>
      <PrepTopicPicture
        topicId={group.topic.id}
        className="size-[3.25rem] shrink-0 rounded-xl border border-border/50"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{body}</p>
        {multi ? (
          <div className="mt-1.5">
            {group.sessions.map((item) => (
              <PrepSessionRow
                key={item.session.id}
                item={item}
                label={item.session.levelName}
                compact
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  )

  if (multi) {
    return <div className={cn("flex items-start gap-3 px-3 py-2.5", allDone && "bg-sage/10")}>{heading}</div>
  }

  const inner = (
    <>
      {heading}
      {only ? <PrepDoneButton item={only} /> : null}
    </>
  )

  const surface = cn(
    "flex items-start gap-3 px-3 py-2.5",
    allDone && "bg-sage/10",
    comingSoon && "opacity-70",
  )

  if (!href) {
    return <div className={surface}>{inner}</div>
  }

  return (
    <Link to={href} className={cn(surface, "transition hover:bg-sky/10")}>
      {inner}
    </Link>
  )
}
