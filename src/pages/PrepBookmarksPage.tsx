import { useEffect, useMemo, useState } from "react"
import { BackButton } from "@/components/app-shell/BackButton"
import { StudyVocabList } from "@/components/adventure/StudyVocabList"
import { Button } from "@/components/ui/button"
import {
  bookmarkChangeCount,
  filterStudyGroups,
  getPrepBookmarkSections,
} from "@/data/learning/prep-study"
import { bookmarkKey, parseBookmarkKey, toggleBookmarkInList } from "@/lib/bookmarks"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function keysFromBookmarks(items: { sessionId: string; wordId: string }[]) {
  return new Set(items.map((item) => bookmarkKey(item.sessionId, item.wordId)))
}

export function PrepBookmarksPage() {
  const { setBookmarkedVocab } = useAppState()
  const { progress } = useActiveJourney()
  const { t } = useI18n()

  const [savedKeys, setSavedKeys] = useState(() => keysFromBookmarks(progress.bookmarkedVocab))
  const [stagedKeys, setStagedKeys] = useState(() => keysFromBookmarks(progress.bookmarkedVocab))

  const savedBookmarks = useMemo(
    () => [...savedKeys].flatMap((key) => parseBookmarkKey(key) ?? []),
    [savedKeys],
  )
  const sections = useMemo(() => getPrepBookmarkSections(savedBookmarks), [savedBookmarks])

  const [activeSessionId, setActiveSessionId] = useState(() => sections[0]?.sessionId ?? "")

  useEffect(() => {
    if (!sections.some((section) => section.sessionId === activeSessionId)) {
      setActiveSessionId(sections[0]?.sessionId ?? "")
    }
  }, [sections, activeSessionId])

  const activeSection = sections.find((section) => section.sessionId === activeSessionId) ?? sections[0]
  const changeCount = bookmarkChangeCount(savedKeys, stagedKeys)

  const visibleIds = useMemo(() => {
    if (!activeSection) return new Set<string>()
    return new Set(activeSection.bookmarkIds)
  }, [activeSection])

  const filteredGroups = activeSection
    ? filterStudyGroups(activeSection.groups, visibleIds)
    : []

  function toggleStaged(wordId: string) {
    if (!activeSection) return
    const sessionId = activeSection.sessionId
    setStagedKeys((current) => {
      const items = [...current].flatMap((key) => parseBookmarkKey(key) ?? [])
      return keysFromBookmarks(toggleBookmarkInList(items, sessionId, wordId))
    })
  }

  function saveChanges() {
    const next = [...stagedKeys].flatMap((key) => parseBookmarkKey(key) ?? [])
    setBookmarkedVocab(next)
    setSavedKeys(new Set(stagedKeys))
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
          isBookmarked={(id) => stagedKeys.has(bookmarkKey(activeSection.sessionId, id))}
          isPendingRemoval={(id) =>
            savedKeys.has(bookmarkKey(activeSection.sessionId, id)) &&
            !stagedKeys.has(bookmarkKey(activeSection.sessionId, id))
          }
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
