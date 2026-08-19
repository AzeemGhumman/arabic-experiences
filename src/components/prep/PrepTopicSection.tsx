import { PrepSessionRow } from "@/components/prep/PrepSessionCard"
import type { PrepCatalogTopic } from "@/data/learning/prep-catalog"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function PrepTopicSection({ group }: { group: PrepCatalogTopic }) {
  const { t } = useI18n()
  const topicCopy = t(`prep.topics.${group.topic.id}.title`)
  const topicTitle = topicCopy.startsWith("prep.topics.") ? group.topic.title : topicCopy
  const hasOpen = group.sessions.some((item) => item.implemented)

  return (
    <section>
      <div className="mb-1 flex items-center justify-between gap-2 px-0.5">
        <h2 className="text-sm font-semibold text-ink">{topicTitle}</h2>
        {group.implementedCount > 0 ? (
          <span className="text-[11px] font-semibold text-ink-soft">
            {group.doneCount}/{group.implementedCount}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card",
          hasOpen ? "border-border divide-y divide-border" : "border-dashed border-border/80",
        )}
      >
        {group.sessions.map((item) => (
          <PrepSessionRow key={item.session.id} item={item} />
        ))}
      </div>
    </section>
  )
}
