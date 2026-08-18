import { Link, Navigate } from "react-router-dom"
import { JourneyMap } from "@/components/journey/JourneyMap"
import { Badge } from "@/components/ui/badge"
import { companionTools, hasTripCompanion } from "@/data/companion"
import { hajjMoments, umrahSteps } from "@/data/umrah"
import { useAppState } from "@/lib/app-state"

export function CompanionPage() {
  const { state } = useAppState()
  const trip = state.activeJourneyId

  if (!hasTripCompanion(trip)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6 pb-8">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.2em] text-terracotta uppercase">Trip companion</p>
        <h1 className="font-display mt-2 text-3xl leading-tight">
          {trip === "umrah" ? "For the days of Umrah" : "For the days of Hajj"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A cheat sheet for the trip itself — rites, later a checklist, duas, and reading. This is not a language
          lesson and does not track journey progress.
        </p>
      </header>

      {trip === "umrah" ? (
        <section>
          <h2 className="font-display text-xl">Umrah rites</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            An outline you can keep open on the trip. Sheets open where content exists.
          </p>
          <JourneyMap steps={umrahSteps} />
          <Link
            to="/companion/umrah/haram"
            className="mt-4 flex min-h-11 items-center justify-center rounded-full border border-border font-semibold"
          >
            Open: Entering Masjid al-Haram
          </Link>
        </section>
      ) : (
        <section>
          <h2 className="font-display text-xl">Hajj days</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            The sequence of the days. Sheets for each moment will land here.
          </p>
          <div className="space-y-3">
            {hajjMoments.map((moment, index) => (
              <article key={moment.id} className="rounded-3xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-ink-soft">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="font-display text-xl">{moment.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{moment.description}</p>
                  </div>
                  <Badge className="bg-gold-soft/70 text-ink">Coming soon</Badge>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl">Coming later</h2>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">
          Tools for the trip itself, kept here rather than inside a journey.
        </p>
        <div className="space-y-3">
          {companionTools.map((tool) => (
            <article key={tool.id} className="rounded-3xl border border-dashed border-border bg-card/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg">{tool.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.subtitle}</p>
                </div>
                <Badge className="bg-gold-soft/70 text-ink">Soon</Badge>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Prototype content only. Religious guidance should be reviewed by qualified scholars before production use.
        This is not a replacement for Nusuk or official guidance.
      </p>
    </div>
  )
}
