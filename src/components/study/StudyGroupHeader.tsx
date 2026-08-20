import { ExperienceScene } from "@/components/mission/ExperienceScenes"
import type { StudyGroup } from "@/lib/learning-types"

export function StudyGroupHeader({ group }: { group: Pick<StudyGroup, "title" | "intro" | "scene"> }) {
  return (
    <div className="space-y-3">
      {group.scene ? <ExperienceScene scene={group.scene} compact className="h-28 w-full" /> : null}
      <div>
        <h2 className="font-display text-xl leading-tight">{group.title}</h2>
        {group.intro ? <p className="mt-1 text-sm text-muted-foreground">{group.intro}</p> : null}
      </div>
    </div>
  )
}
