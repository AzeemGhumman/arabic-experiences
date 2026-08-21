import { Link } from "react-router-dom"
import { LessonDoneButton, LessonRow } from "@/components/study/LessonRow"
import { TopicPicture } from "@/components/study/TopicPicture"
import { lessonAvailability } from "@/data/learning/availability"
import { groupStudyCatalog, type CatalogTopic } from "@/data/learning/study-catalog"
import { useI18n } from "@/lib/i18n"
import type { Topic } from "@/lib/learning-types"
import { cn } from "@/lib/utils"

export function useTopicCopy(topic: Topic) {
  const { t } = useI18n()
  const titlePath = `study.topics.${topic.id}.title`
  const bodyPath = `study.topics.${topic.id}.body`
  const title = t(titlePath)
  const body = t(bodyPath)
  return {
    title: title.startsWith("study.topics.") ? topic.title : title,
    body: body.startsWith("study.topics.") ? topic.description : body,
  }
}

export function TopicList({ catalog }: { catalog: CatalogTopic[] }) {
  const { t } = useI18n()
  const shelves = groupStudyCatalog(catalog)

  return (
    <div className="space-y-6">
      {shelves.map((shelf) => {
        const title = t(`study.shelves.${shelf.id}.title`)
        return (
          <section key={shelf.id}>
            <h2 className="px-0.5 text-[10px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
              {title}
            </h2>
            <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {shelf.topics.map((group) => (
                <TopicRow key={group.topic.id} group={group} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function TopicRow({ group }: { group: CatalogTopic }) {
  const { t } = useI18n()
  const { title, body } = useTopicCopy(group.topic)
  const multi = group.lessons.length > 1
  const only = group.lessons[0]
  const allDone = group.implementedCount > 0 && group.doneCount === group.implementedCount
  const comingSoon = only ? lessonAvailability(only.lesson.id) === "coming-soon" : false
  const href =
    !multi && only && lessonAvailability(only.lesson.id) === "open"
      ? `/lessons/${only.lesson.id}?from=study`
      : undefined

  const heading = (
    <>
      <TopicPicture
        topicId={group.topic.id}
        className="size-[3.25rem] shrink-0 rounded-xl border border-border/50"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{body}</p>
        {multi ? (
          <div className="mt-1.5">
            {group.lessons.map((item) => (
              <LessonRow
                key={item.lesson.id}
                item={item}
                label={
                  item.lesson.level >= 2 ? t("study.levelAdvanced") : t("study.levelBasic")
                }
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
      {only ? <LessonDoneButton item={only} /> : null}
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
