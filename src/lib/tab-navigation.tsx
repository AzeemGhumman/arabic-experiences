import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react"
import { useLocation, useNavigate, useNavigationType } from "react-router-dom"

export type TabId = "home" | "study" | "progress" | "companion" | "profile"

const TAB_ROOTS: Record<TabId, string> = {
  home: "/",
  study: "/study",
  progress: "/progress",
  companion: "/companion",
  profile: "/profile",
}

function initialStacks(): Record<TabId, string[]> {
  return {
    home: [TAB_ROOTS.home],
    study: [TAB_ROOTS.study],
    progress: [TAB_ROOTS.progress],
    companion: [TAB_ROOTS.companion],
    profile: [TAB_ROOTS.profile],
  }
}

export function getTabForPath(pathname: string): TabId {
  if (pathname.startsWith("/profile")) return "profile"
  if (pathname.startsWith("/progress")) return "progress"
  if (pathname.startsWith("/companion")) return "companion"
  if (pathname.startsWith("/study") || pathname.startsWith("/lessons")) return "study"
  return "home"
}

function pathKey(pathname: string, search: string) {
  return `${pathname}${search}`
}

type TabNavigationContextValue = {
  activeTab: TabId
  switchTab: (tab: TabId) => void
  goBack: (fallback?: string) => void
  resetTabToRoot: (tab?: TabId) => void
}

const TabNavigationContext = createContext<TabNavigationContextValue | null>(null)

export function TabNavigationProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const stacksRef = useRef(initialStacks())
  const skipStackUpdate = useRef(false)

  const current = pathKey(location.pathname, location.search)
  const activeTab = getTabForPath(location.pathname)

  useEffect(() => {
    if (skipStackUpdate.current) {
      skipStackUpdate.current = false
      return
    }

    const tab = getTabForPath(location.pathname)
    const stacks = stacksRef.current
    const stack = stacks[tab]

    if (navigationType === "POP") {
      const index = stack.lastIndexOf(current)
      if (index >= 0) {
        stacks[tab] = stack.slice(0, index + 1)
      }
      return
    }

    if (navigationType === "REPLACE") {
      if (stack.at(-1) === current) return
      stacks[tab] = [...stack.slice(0, -1), current]
      return
    }

    if (stack.at(-1) === current) return
    stacks[tab] = [...stack, current]
  }, [current, location.pathname, navigationType])

  const switchTab = useCallback(
    (tab: TabId) => {
      const target = stacksRef.current[tab].at(-1) ?? TAB_ROOTS[tab]
      if (pathKey(location.pathname, location.search) === target) return
      skipStackUpdate.current = true
      navigate(target)
    },
    [location.pathname, location.search, navigate],
  )

  const goBack = useCallback(
    (fallback?: string) => {
      const tab = getTabForPath(location.pathname)
      const stack = stacksRef.current[tab]
      if (stack.length > 1) {
        const nextStack = stack.slice(0, -1)
        stacksRef.current[tab] = nextStack
        skipStackUpdate.current = true
        navigate(nextStack.at(-1) ?? TAB_ROOTS[tab])
        return
      }
      navigate(fallback ?? TAB_ROOTS[tab])
    },
    [location.pathname, navigate],
  )

  const resetTabToRoot = useCallback(
    (tab: TabId = getTabForPath(location.pathname)) => {
      stacksRef.current[tab] = [TAB_ROOTS[tab]]
      skipStackUpdate.current = true
      navigate(TAB_ROOTS[tab])
    },
    [location.pathname, navigate],
  )

  const value = useMemo(
    () => ({
      activeTab,
      switchTab,
      goBack,
      resetTabToRoot,
    }),
    [activeTab, switchTab, goBack, resetTabToRoot],
  )

  return createElement(TabNavigationContext.Provider, { value }, children)
}

export function useTabNavigation() {
  const context = useContext(TabNavigationContext)
  if (!context) {
    throw new Error("useTabNavigation must be used within TabNavigationProvider")
  }
  return context
}

export function isTabActive(tab: TabId, pathname: string) {
  return getTabForPath(pathname) === tab
}
