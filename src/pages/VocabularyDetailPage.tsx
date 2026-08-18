import { Link, useParams } from "react-router-dom"
import { Volume2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QURAN_CORPUS_NOTE, getVocab, getVocabByIds } from "@/data/vocabulary"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { BackButton } from "@/components/app-shell/BackButton"
import type { Confidence } from "@/lib/storage"
import { cn } from "@/lib/utils"

const confidenceOptions: Confidence[] = ["new", "seen", "recognized", "confident"]

export function VocabularyDetailPage() {
  const { id = "" } = useParams()
  const item = getVocab(id)
  const { setConfidence, discoverWord } = useAppState()
  const { progress } = useActiveJourney()
  const [playing, setPlaying] = useState(false)

  if (!item) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl">Word not found</p>
        <Link to="/progress" className="mt-3 inline-block text-sm font-semibold text-sage-deep">
          Back to your words
        </Link>
      </div>
    )
  }

  const confidence = progress.wordConfidence[item.id] ?? item.confidence
  const related = getVocabByIds(item.relatedIds ?? [])

  return (
    <div className="space-y-5 pb-10">
      <BackButton to="/progress" />
      <header className="rounded-[1.75rem] bg-linear-to-br from-gold-soft/50 to-paper p-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          {item.category}
        </p>
        <p className="arabic-text mt-4 text-5xl">{item.arabic}</p>
        <p className="mt-3 text-lg italic text-ink-soft">{item.transliteration}</p>
        {item.ipa ? <p className="text-sm text-muted-foreground">{item.ipa}</p> : null}
        <p className="mt-1 text-xl font-medium">{item.meaning}</p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => {
            setPlaying(true)
            discoverWord(item.id)
            window.setTimeout(() => setPlaying(false), 1200)
          }}
        >
          <Volume2 />
          {playing ? "Playing…" : "Listen"}
        </Button>
      </header>

      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          Visual
        </p>
        <div className="mt-3 flex h-28 items-center justify-center rounded-2xl bg-secondary/70 font-display text-4xl">
          {item.arabic}
        </div>
      </section>

      {item.sourceScene && (
        <section className="rounded-3xl border border-border bg-card p-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
            Where you met this word
          </p>
          <p className="mt-2 font-display text-xl">{item.sourceScene}</p>
        </section>
      )}

      {typeof item.quranFrequency === "number" && (
        <section className="rounded-3xl border border-border bg-card p-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
            Quran familiarity
          </p>
          <p className="font-display mt-2 text-3xl">{item.quranFrequency}</p>
          <p className="text-sm text-muted-foreground">
            lemma occurrences in the Quranic Arabic Corpus
            {item.quranPos ? ` · ${item.quranPos}` : ""}
          </p>
          {item.quranLemma ? (
            <p className="mt-2 text-sm text-muted-foreground">
              In the Quran this usually appears as{" "}
              <span className="arabic-text text-base text-ink">{item.quranLemma}</span>.
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">{QURAN_CORPUS_NOTE}</p>
        </section>
      )}

      {typeof item.msaRank === "number" && (
        <section className="rounded-3xl border border-border bg-card p-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
            Everyday Arabic
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Rank {item.msaRank} in a 5,000-word MSA frequency list
            {item.msaGloss ? ` · ${item.msaGloss}` : ""}.
          </p>
        </section>
      )}

      {item.phrases && item.phrases.length > 0 && (
        <section className="rounded-3xl border border-border bg-card p-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
            Try saying
          </p>
          <ul className="mt-3 space-y-3">
            {item.phrases.map((phrase) => (
              <li key={phrase.arabic}>
                <p className="arabic-text text-2xl">{phrase.arabic}</p>
                <p className="text-sm italic text-ink-soft">{phrase.transliteration}</p>
                <p className="text-sm text-muted-foreground">{phrase.meaning}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          Confidence
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {confidenceOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setConfidence(item.id, option)}
              className={cn(
                "rounded-2xl border px-3 py-3 text-sm font-semibold capitalize",
                confidence === option
                  ? "border-sage bg-sage/10 text-sage-deep"
                  : "border-border bg-paper",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase">
            Related words
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((word) => (
              <Link key={word.id} to={`/vocabulary/${word.id}`}>
                <Badge className="bg-paper px-3 py-2 text-sm normal-case tracking-normal">
                  <span className="arabic-text ms-1 text-base">{word.arabic}</span>
                  <span className="text-muted-foreground"> {word.meaning}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
