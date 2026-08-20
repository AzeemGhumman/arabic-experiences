import { useEffect, useMemo, useState } from "react"
import { BackButton } from "@/components/app-shell/BackButton"
import { StudyVocabList } from "@/components/mission/StudyVocabList"
import { Button } from "@/components/ui/button"
import {
  bookmarkChangeCount,
  filterStudyGroups,
  getStudyBookmarkSections,
} from "@/data/learning/study-bookmarks"
import { bookmarkKey, parseBookmarkKey, toggleBookmarkInList } from "@/lib/bookmarks"
import { useActiveJourney, useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function keysFromBookmarks(items: { lessonId: string; wordId: string }[]) {
  return new Set(items.map((item) => bookmarkKey(item.lessonId, item.wordId)))
}

export function StudyBookmarksPage() {
  const { setBookmarkedVocab } = useAppState()
  const { progress } = useActiveJourney()
  const { t } = useI18n()

  const [savedKeys, setSavedKeys] = useState(() => keysFromBookmarks(progress.bookmarkedVocab))
  const [stagedKeys, setStagedKeys] = useState(() => keysFromBookmarks(progress.bookmarkedVocab))

  const savedBookmarks = useMemo(
    () => [...savedKeys].flatMap((key) => parseBookmarkKey(key) ?? []),
    [savedKeys],
  )
  const sections = useMemo(() => getStudyBookmarkSections(savedBookmarks), [savedBookmarks])

  const [activeLessonId, setActiveLessonId] = useState(() => sections[0]?.lessonId ?? "")

  useEffect(() => {
    if (!sections.some((section) => section.lessonId === activeLessonId)) {
      setActiveLessonId(sections[0]?.lessonId ?? "")
    }
  }, [sections, activeLessonId])

  const activeSection = sections.find((section) => section.lessonId === activeLessonId) ?? sections[0]
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
    const lessonId = activeSection.lessonId
    setStagedKeys((current) => {
      const items = [...current].flatMap((key) => parseBookmarkKey(key) ?? [])
      return keysFromBookmarks(toggleBookmarkInList(items, lessonId, wordId))
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
          <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">{t("study.kicker")}</p>
          <h1 className="font-display mt-1 text-2xl leading-tight">{t("study.bookmarksPageTitle")}</h1>
        </header>
        <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("study.bookmarksEmpty")}
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", changeCount > 0 ? "pb-24" : "pb-8")}>
      <header>
        <BackButton />
        <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">{t("study.kicker")}</p>
        <h1 className="font-display mt-1 text-2xl leading-tight">{t("study.bookmarksPageTitle")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("study.bookmarksPageBody")}</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map((section) => {
          const active = section.lessonId === activeSection?.lessonId
          const count = section.bookmarkIds.length
          return (
            <button
              key={section.lessonId}
              type="button"
              onClick={() => setActiveLessonId(section.lessonId)}
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
          packId={activeSection.lessonId}
          groups={filteredGroups}
          isBookmarked={(id) => stagedKeys.has(bookmarkKey(activeSection.lessonId, id))}
          isPendingRemoval={(id) =>
            savedKeys.has(bookmarkKey(activeSection.lessonId, id)) &&
            !stagedKeys.has(bookmarkKey(activeSection.lessonId, id))
          }
          onToggleBookmark={toggleStaged}
        />
      ) : null}

      {changeCount > 0 ? (
        <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-[430px] px-4 lg:max-w-[480px]">
          <Button type="button" className="w-full shadow-lg" variant="terracotta" onClick={saveChanges}>
            {t("study.saveBookmarks", { count: changeCount })}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
