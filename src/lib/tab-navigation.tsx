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
import { returnPathFromFromParam } from "@/lib/navigation"
import { useMissionNavigationGuardOptional } from "@/lib/mission-navigation-guard"

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

function resolveBackTarget(
  tab: TabId,
  stack: string[],
  explicitFallback?: string,
  fromQueryFallback?: string,
) {
  const tabRoot = TAB_ROOTS[tab]
  const contextualFallback = explicitFallback ?? fromQueryFallback

  if (stack.length > 1) {
    const destination = stack.at(-2) ?? tabRoot
    if (contextualFallback && destination === tabRoot && contextualFallback !== tabRoot) {
      return contextualFallback
    }
    return destination
  }

  return contextualFallback ?? tabRoot
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
  const guard = useMissionNavigationGuardOptional()
  const stacksRef = useRef(initialStacks())
  const skipStackUpdate = useRef(false)
  const crossTabReturnRef = useRef<string | null>(null)
  const prevLocationRef = useRef({ pathname: location.pathname, search: location.search })

  const current = pathKey(location.pathname, location.search)
  const activeTab = getTabForPath(location.pathname)

  useEffect(() => {
    const prev = prevLocationRef.current
    const prevKey = pathKey(prev.pathname, prev.search)
    const prevTab = getTabForPath(prev.pathname)

    if (skipStackUpdate.current) {
      skipStackUpdate.current = false
      prevLocationRef.current = { pathname: location.pathname, search: location.search }
      return
    }

    const tab = getTabForPath(location.pathname)
    const stacks = stacksRef.current
    const stack = stacks[tab]

    if (navigationType === "POP") {
      crossTabReturnRef.current = null
      const index = stack.lastIndexOf(current)
      if (index >= 0) {
        stacks[tab] = stack.slice(0, index + 1)
      }
      prevLocationRef.current = { pathname: location.pathname, search: location.search }
      return
    }

    if (navigationType === "PUSH" && prevKey !== current) {
      if (prevTab !== tab) {
        crossTabReturnRef.current = prevKey
      } else {
        crossTabReturnRef.current = null
      }
    }

    if (navigationType === "REPLACE") {
      crossTabReturnRef.current = null
      if (stack.at(-1) === current) {
        prevLocationRef.current = { pathname: location.pathname, search: location.search }
        return
      }
      stacks[tab] = [...stack.slice(0, -1), current]
      prevLocationRef.current = { pathname: location.pathname, search: location.search }
      return
    }

    if (stack.at(-1) === current) {
      prevLocationRef.current = { pathname: location.pathname, search: location.search }
      return
    }
    stacks[tab] = [...stack, current]
    prevLocationRef.current = { pathname: location.pathname, search: location.search }
  }, [current, location.pathname, location.search, navigationType])

  const switchTab = useCallback(
    (tab: TabId) => {
      const doSwitch = () => {
        crossTabReturnRef.current = null
        const target = stacksRef.current[tab].at(-1) ?? TAB_ROOTS[tab]
        if (pathKey(location.pathname, location.search) === target) return
        skipStackUpdate.current = true
        navigate(target)
      }

      const currentTab = getTabForPath(location.pathname)
      if (guard?.missionInProgress && tab !== currentTab) {
        guard.guardNavigation(doSwitch)
        return
      }
      doSwitch()
    },
    [guard, location.pathname, location.search, navigate],
  )

  const goBack = useCallback(
    (fallback?: string) => {
      const doBack = () => {
        const tab = getTabForPath(location.pathname)
        const stack = stacksRef.current[tab]
        const fromQueryFallback = returnPathFromFromParam(new URLSearchParams(location.search).get("from"))

        if (crossTabReturnRef.current) {
          const target = crossTabReturnRef.current
          crossTabReturnRef.current = null
          if (stack.length > 1) {
            stacksRef.current[tab] = stack.slice(0, -1)
          }
          skipStackUpdate.current = true
          navigate(target)
          return
        }

        const target = resolveBackTarget(tab, stack, fallback, fromQueryFallback)
        if (stack.length > 1) {
          stacksRef.current[tab] = stack.slice(0, -1)
        }
        skipStackUpdate.current = true
        navigate(target)
      }

      if (guard?.missionInProgress) {
        guard.guardNavigation(doBack)
        return
      }
      doBack()
    },
    [guard, location.pathname, location.search, navigate],
  )

  const resetTabToRoot = useCallback(
    (tab: TabId = getTabForPath(location.pathname)) => {
      crossTabReturnRef.current = null
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
