import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { InteractiveHotspot } from "@/components/scene/InteractiveHotspot"
import { MissionCard } from "@/components/scene/MissionCard"
import { RestaurantScene } from "@/components/scene/Scenes"
import { VocabularyReveal } from "@/components/vocabulary/VocabularyReveal"
import { Button } from "@/components/ui/button"
import { restaurantHotspots, restaurantMission } from "@/data/scenarios"
import { getVocab } from "@/data/vocabulary"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { BackButton } from "@/components/app-shell/BackButton"

export function RestaurantScenarioPage() {
  const { state, discoverWord, askRestaurantItem, completeScenario } = useAppState()
  const { progress } = useActiveJourney()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedSpot = restaurantHotspots.find((spot) => spot.vocabId === selectedId)
  const selected = selectedId ? getVocab(selectedId) : undefined
  const noticedWater = progress.discoveredVocab.includes("water")
  const noticedRice = progress.discoveredVocab.includes("rice")
  const askedWater = state.restaurantAsked.includes("water")
  const askedRice = state.restaurantAsked.includes("rice")
  const complete = askedWater && askedRice
  const waterAsk = getVocab("water")?.phrases?.[0] ?? restaurantMission.phrases.water
  const riceAsk = getVocab("rice")?.phrases?.[0] ?? restaurantMission.phrases.rice

  const discoveredCount = useMemo(
    () => restaurantHotspots.filter((spot) => progress.discoveredVocab.includes(spot.vocabId)).length,
    [progress.discoveredVocab],
  )

  useEffect(() => {
    if (complete) completeScenario("restaurant")
  }, [complete, completeScenario])

  return (
    <div className="space-y-5 pb-10">
      <header>
        <BackButton />
        <p className="text-[11px] font-semibold tracking-[0.2em] text-sage-deep uppercase">
          Arabic mission
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">Order at a restaurant</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You have a seat at the table. Tap what you can see, then ask for water and rice.
        </p>
      </header>

      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-border"
        role="group"
        aria-label="Restaurant table. Tap objects to learn their Arabic names."
      >
        <div className="aspect-[4/3]">
          <RestaurantScene className="h-full w-full object-cover" />
        </div>
        {restaurantHotspots.map((spot) => {
          const discovered = progress.discoveredVocab.includes(spot.vocabId)
          const word = getVocab(spot.vocabId)
          return (
            <InteractiveHotspot
              key={spot.id}
              label={spot.label}
              caption={discovered ? word?.arabic : undefined}
              x={spot.x}
              y={spot.y}
              w={spot.w}
              h={spot.h}
              discovered={discovered}
              selected={selectedId === spot.vocabId}
              onSelect={() => {
                setSelectedId(spot.vocabId)
                discoverWord(spot.vocabId)
              }}
            />
          )
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {discoveredCount} of {restaurantHotspots.length} things on the table noticed
      </p>

      {selected && selectedSpot ? (
        <div className="space-y-2">
          <VocabularyReveal
            item={selected}
            notice={selectedSpot.notice}
            showTransliteration={state.showTransliteration}
            showTranslation={state.showTranslation}
          />
          <Link
            to={`/vocabulary/${selected.id}`}
            className="block text-center text-sm font-semibold text-sage-deep"
          >
            Open word detail
          </Link>
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-border bg-paper px-4 py-6 text-center text-sm text-muted-foreground">
          Tap the pitcher, the rice, the bread, the chair — whatever you can name in the room.
        </p>
      )}

      <MissionCard prompt={restaurantMission.prompt} complete={complete}>
        <p className="mt-3 text-sm text-muted-foreground">
          {noticedWater && noticedRice
            ? "You have seen both. Now ask for them."
            : "Notice the water pitcher and the rice bowl first. Then the words are yours to use."}
        </p>
        <div className="mt-4 grid gap-2">
          <Button
            variant={askedWater ? "default" : "outline"}
            disabled={!noticedWater}
            onClick={() => askRestaurantItem("water")}
          >
            {askedWater
              ? "Asked for water"
              : noticedWater
                ? "Ask for water"
                : "Find the water first"}
          </Button>
          <Button
            variant={askedRice ? "default" : "outline"}
            disabled={!noticedRice}
            onClick={() => askRestaurantItem("rice")}
          >
            {askedRice
              ? "Asked for rice"
              : noticedRice
                ? "Ask for rice"
                : "Find the rice first"}
          </Button>
        </div>
        {(askedWater || askedRice) && (
          <div className="mt-3 space-y-1 text-sm">
            {askedWater && (
              <p>
                <span className="arabic-text text-lg"> {waterAsk.arabic} </span>
                {state.showTransliteration ? ` · ${waterAsk.transliteration}` : ""}
                {state.showTranslation ? ` · ${waterAsk.meaning}` : ""}
              </p>
            )}
            {askedRice && (
              <p>
                <span className="arabic-text text-lg"> {riceAsk.arabic} </span>
                {state.showTransliteration ? ` · ${riceAsk.transliteration}` : ""}
                {state.showTranslation ? ` · ${riceAsk.meaning}` : ""}
              </p>
            )}
          </div>
        )}
      </MissionCard>
    </div>
  )
}
