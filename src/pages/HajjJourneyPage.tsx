import { AdventureCard } from "@/components/adventure/AdventureCard"
import { HomeShell } from "@/components/home/HomeShell"
import { getAdventure } from "@/data/learning/adventures"
import { useActiveJourney } from "@/lib/app-state"

export function HajjJourneyPage() {
  const { progress } = useActiveJourney()
  const bus = getAdventure("hajj-bus")
  const taxi = getAdventure("taxi-hotel")

  return (
    <HomeShell
      kicker="Hajj"
      kickerClassName="text-gold"
      title="Arabic for the days of Hajj"
      intro="Each situation is a mission. Prep for that situation is the vocabulary and tools. The rites cheat sheet lives in the Trip tab."
    >
      {taxi ? (
        <AdventureCard
          adventure={taxi}
          completed={progress.completedAdventureIds.includes(taxi.id)}
          plays={progress.adventurePlayCounts[taxi.id]}
        />
      ) : null}
      {bus ? <AdventureCard adventure={bus} /> : null}
    </HomeShell>
  )
}
