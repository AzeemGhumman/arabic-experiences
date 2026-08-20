import { ActivityMap } from "@/components/mission/ActivityMap"
import { MapHowTo } from "@/components/mission/MapHowTo"
import { missionAvailability } from "@/data/learning/availability"
import { umrahGraph } from "@/data/learning/mission-graph"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function UmrahJourneyPage() {
  const { state, dismissMapIntro } = useAppState()
  const { progress } = useActiveJourney()
  const { mission } = useI18n()
  const next = umrahGraph.nodes.find(
    (node) => missionAvailability(node.id, progress.completedMissionIds, node) === "open",
  )
  const showHowTo = !state.mapIntroDismissed && progress.completedMissionIds.length === 0

  return (
    <div className="space-y-3 pb-8">
      {showHowTo ? (
        <MapHowTo
          nextPlace={next ? mission(next.id, next.label) : undefined}
          nextHref={next ? `/missions/${next.id}` : undefined}
          onDismiss={dismissMapIntro}
        />
      ) : null}
      <ActivityMap graph={umrahGraph} completedIds={progress.completedMissionIds} />
    </div>
  )
}
