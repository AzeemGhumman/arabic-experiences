import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { InteractiveHotspot } from "@/components/scene/InteractiveHotspot"
import { GardenScene } from "@/components/scene/Scenes"
import { VocabularyReveal } from "@/components/vocabulary/VocabularyReveal"
import { gardenHotspots } from "@/data/scenarios"
import { QURAN_CORPUS_NOTE, getVocab } from "@/data/vocabulary"
import { QURAN_APPROX_WORD_COUNT } from "@/lexicon"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { BackButton } from "@/components/app-shell/BackButton"

const gardenIds = gardenHotspots.map((spot) => spot.vocabId)

export function GardenScenarioPage() {
  const { state, discoverWord, markGardenCelebrated } = useAppState()
  const { progress } = useActiveJourney()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = selectedId ? getVocab(selectedId) : undefined
  const discoveredHere = gardenIds.filter((id) => progress.discoveredVocab.includes(id))
  const allFound = discoveredHere.length === gardenIds.length

  const { corpusTotal, quranicCount, coveragePct } = useMemo(() => {
    const found = gardenIds.filter((id) => progress.discoveredVocab.includes(id))
    const total = found.reduce((sum, id) => sum + (getVocab(id)?.quranFrequency ?? 0), 0)
    const count = found.filter((id) => getVocab(id)?.quranFrequency).length
    return {
      corpusTotal: total,
      quranicCount: count,
      coveragePct: Math.max(0.1, Math.round((total / QURAN_APPROX_WORD_COUNT) * 1000) / 10),
    }
  }, [progress.discoveredVocab])

  useEffect(() => {
    if (allFound && !state.gardenCelebrated) {
      markGardenCelebrated()
    }
  }, [allFound, markGardenCelebrated, state.gardenCelebrated])

  return (
    <div className="space-y-5 pb-10">
      <header>
        <BackButton />
        <p className="text-[11px] font-semibold tracking-[0.2em] text-sky-deep uppercase">
          A quiet garden
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight">Explore the Garden</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Notice the tree, the water, the light. Names can wait until you have looked.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-border">
        <div className="aspect-[4/3]">
          <GardenScene />
        </div>
        {gardenHotspots.map((spot) => (
          <InteractiveHotspot
            key={spot.id}
            label={spot.label}
            x={spot.x}
            y={spot.y}
            discovered={progress.discoveredVocab.includes(spot.vocabId)}
            selected={selectedId === spot.vocabId}
            onSelect={() => {
              setSelectedId(spot.vocabId)
              discoverWord(spot.vocabId)
            }}
          />
        ))}
      </div>

      {selected ? (
        <div className="space-y-2">
          <VocabularyReveal
            item={selected}
            contextLabel="Noticed in the garden"
            showTransliteration={state.showTransliteration}
            showTranslation={state.showTranslation}
          />
          <Link
            to={`/vocabulary/${selected.id}`}
            className="block text-center text-sm font-semibold text-sky-deep"
          >
            Open word detail
          </Link>
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-border bg-paper px-4 py-6 text-center text-sm text-muted-foreground">
          Tap the sun, the tree, the water, the fruit, the earth, or the bird.
        </p>
      )}

      {allFound && (
        <section className="rounded-3xl border border-sky/30 bg-sky/10 p-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-deep uppercase">
            After the walk
          </p>
          <h2 className="font-display mt-1 text-2xl">You walked the garden.</h2>
          <p className="mt-2 text-sm leading-relaxed">
            {quranicCount} of these {gardenIds.length} words appear in the Quran, totaling{" "}
            {corpusTotal} lemma occurrences in the Quranic Arabic Corpus.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{QURAN_CORPUS_NOTE}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper">
            <div
              className="h-full rounded-full bg-sky-deep"
              style={{ width: `${Math.min(coveragePct, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            About {coveragePct}% of an approximate {QURAN_APPROX_WORD_COUNT.toLocaleString()} word
            Quran, if each lemma occurrence is counted once.
          </p>
        </section>
      )}
    </div>
  )
}
