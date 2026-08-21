import { ExperienceScene } from "@/components/mission/ExperienceScenes"
import { resolveLessonGroupCopy } from "@/lib/lesson-copy"
import { useI18n } from "@/lib/i18n"
import type { StudyGroup } from "@/lib/learning-types"

export function StudyGroupHeader({
  lessonId,
  group,
}: {
  lessonId: string
  group: Pick<StudyGroup, "title" | "intro" | "scene" | "copyKey">
}) {
  const { pack } = useI18n()
  const copy = resolveLessonGroupCopy(pack, lessonId, group.copyKey, {
    title: group.title,
    intro: group.intro,
  })

  return (
    <div className="space-y-3">
      {group.scene ? <ExperienceScene scene={group.scene} compact className="h-28 w-full" /> : null}
      <div>
        <h2 className="font-display text-xl leading-tight">{copy.title}</h2>
        {copy.intro ? <p className="mt-1 text-sm text-muted-foreground">{copy.intro}</p> : null}
      </div>
    </div>
  )
}
