import { ActivityMap } from "@/components/adventure/ActivityMap"
import { AdventureCard } from "@/components/adventure/AdventureCard"
import { HomeShell } from "@/components/home/HomeShell"
import { SceneCard } from "@/components/scene/SceneCard"
import { MiniScene, RestaurantScene } from "@/components/scene/Scenes"
import { adventures } from "@/data/learning/adventures"
import { arabicGraph } from "@/data/learning/mission-graph"
import { arabicScenarios } from "@/data/scenarios"
import { useActiveJourney } from "@/lib/app-state"

const mini: Record<string, "airport" | "taxi" | "hotel" | "market" | "directions" | "pharmacy" | "meeting" | "buying"> =
  {
    airport: "airport",
    taxi: "taxi",
    hotel: "hotel",
    market: "market",
    directions: "directions",
    pharmacy: "pharmacy",
    meeting: "meeting",
    buying: "buying",
  }

export function ArabicJourneyPage() {
  const { progress } = useActiveJourney()
  const later = adventures.filter((item) => !item.playable)

  return (
    <HomeShell
      kicker="Arabic for real life"
      kickerClassName="text-sage-deep"
      title="Complete the mission"
      intro="Tap a place to do the mission or prepare. A mission can have more than one practice."
    >
      <ActivityMap graph={arabicGraph} completedIds={progress.completedAdventureIds} />

      <section className="space-y-3">
        <h2 className="font-display text-xl">Look around a place</h2>
        {arabicScenarios
          .filter((scenario) => scenario.id === "restaurant")
          .map((scenario) => (
            <SceneCard
              key={scenario.id}
              title={scenario.title}
              description={scenario.description}
              status={scenario.status}
              to="/journeys/arabic/restaurant"
              illustration={<RestaurantScene />}
            />
          ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Later on the path</h2>
        {later.map((adventure) => (
          <AdventureCard key={adventure.id} adventure={adventure} />
        ))}
        {arabicScenarios
          .filter((scenario) => scenario.id !== "restaurant")
          .map((scenario) => (
            <SceneCard
              key={scenario.id}
              title={scenario.title}
              description={scenario.description}
              status={scenario.status}
              illustration={<MiniScene variant={mini[scenario.id]} />}
            />
          ))}
      </section>
    </HomeShell>
  )
}
