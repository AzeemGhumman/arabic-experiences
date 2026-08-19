import { useEffect, useMemo, useState } from "react"
import { BackButton } from "@/components/app-shell/BackButton"
import { StudyVocabList } from "@/components/adventure/StudyVocabList"
import { Button } from "@/components/ui/button"
import {
  bookmarkChangeCount,
  filterStudyGroups,
  getPrepBookmarkSections,
} from "@/data/learning/prep-study"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function PrepBookmarksPage() {
  const { setBookmarkedVocab } = useAppState()
  const { progress } = useActiveJourney()
  const { t } = useI18n()

  const [savedIds, setSavedIds] = useState(() => new Set(progress.bookmarkedVocab))
  const [stagedIds, setStagedIds] = useState(() => new Set(progress.bookmarkedVocab))

  const sections = useMemo(() => getPrepBookmarkSections([...savedIds]), [savedIds])

  const [activeSessionId, setActiveSessionId] = useState(() => sections[0]?.sessionId ?? "")

  useEffect(() => {
    if (!sections.some((section) => section.sessionId === activeSessionId)) {
      setActiveSessionId(sections[0]?.sessionId ?? "")
    }
  }, [sections, activeSessionId])

  const activeSection = sections.find((section) => section.sessionId === activeSessionId) ?? sections[0]
  const changeCount = bookmarkChangeCount(savedIds, stagedIds)

  const visibleIds = useMemo(() => {
    if (!activeSection) return new Set<string>()
    return new Set(activeSection.bookmarkIds)
  }, [activeSection])

  const filteredGroups = activeSection
    ? filterStudyGroups(activeSection.groups, visibleIds)
    : []

  function toggleStaged(id: string) {
    setStagedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function saveChanges() {
    const next = new Set(stagedIds)
    setBookmarkedVocab([...next])
    setSavedIds(next)
  }

  if (sections.length === 0) {
    return (
      <div className="space-y-4 pb-8">
        <header>
          <BackButton />
          <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">{t("prep.kicker")}</p>
          <h1 className="font-display mt-1 text-2xl leading-tight">{t("prep.bookmarksPageTitle")}</h1>
        </header>
        <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("prep.bookmarksEmpty")}
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", changeCount > 0 ? "pb-24" : "pb-8")}>
      <header>
        <BackButton />
        <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">{t("prep.kicker")}</p>
        <h1 className="font-display mt-1 text-2xl leading-tight">{t("prep.bookmarksPageTitle")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("prep.bookmarksPageBody")}</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map((section) => {
          const active = section.sessionId === activeSection?.sessionId
          const count = section.bookmarkIds.length
          return (
            <button
              key={section.sessionId}
              type="button"
              onClick={() => setActiveSessionId(section.sessionId)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                active
                  ? "border-gold bg-gold/15 text-ink"
                  : "border-border bg-card text-muted-foreground hover:border-gold/40",
              )}
            >
              {section.title}
              <span className="ms-1.5 text-[11px] font-semibold opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {activeSection ? (
        <StudyVocabList
          packId={activeSection.sessionId}
          groups={filteredGroups}
          isBookmarked={(id) => stagedIds.has(id)}
          isPendingRemoval={(id) => savedIds.has(id) && !stagedIds.has(id)}
          onToggleBookmark={toggleStaged}
        />
      ) : null}

      {changeCount > 0 ? (
        <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-[430px] px-4 lg:max-w-[480px]">
          <Button type="button" className="w-full shadow-lg" variant="terracotta" onClick={saveChanges}>
            {t("prep.saveBookmarks", { count: changeCount })}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
