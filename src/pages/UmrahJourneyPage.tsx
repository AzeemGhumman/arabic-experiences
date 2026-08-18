import { ActivityMap } from "@/components/adventure/ActivityMap"
import { umrahGraph } from "@/data/learning/mission-graph"
import { useActiveJourney } from "@/lib/app-state"

export function UmrahJourneyPage() {
  const { progress } = useActiveJourney()

  return <ActivityMap graph={umrahGraph} completedIds={progress.completedAdventureIds} />
}
