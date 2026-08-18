import { HomeShell } from "@/components/home/HomeShell"
import { SceneCard } from "@/components/scene/SceneCard"
import { GardenScene, MiniScene } from "@/components/scene/Scenes"
import { quranScenes } from "@/data/scenarios"

export function QuranJourneyPage() {
  return (
    <HomeShell
      kicker="Vocabulary adventures"
      kickerClassName="text-sky-deep"
      title="Learn the world first"
      intro="Walk through places. Prep for a place is extra vocabulary when you want it. The Quranic connection is revealed after you have met the words."
    >
      <div className="grid gap-4">
        {quranScenes.map((scene) => (
          <SceneCard
            key={scene.id}
            title={scene.title}
            description={scene.description}
            status={scene.status}
            to={scene.id === "garden" ? "/journeys/quran/garden" : undefined}
            illustration={
              scene.id === "garden" ? (
                <GardenScene />
              ) : (
                <MiniScene
                  variant={
                    scene.id === "animals" ? "animals" : scene.id === "actions" ? "actions" : "home"
                  }
                />
              )
            }
          />
        ))}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Prototype content only. Quranic frequency figures are demo data.
      </p>
    </HomeShell>
  )
}
