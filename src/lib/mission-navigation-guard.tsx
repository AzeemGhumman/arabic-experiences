import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n"

type MissionNavigationGuardContextValue = {
  missionInProgress: boolean
  setMissionInProgress: (active: boolean) => void
  guardNavigation: (action: () => void) => void
}

const MissionNavigationGuardContext = createContext<MissionNavigationGuardContextValue | null>(null)

export function MissionNavigationGuardProvider({ children }: { children: ReactNode }) {
  const [missionInProgress, setMissionInProgress] = useState(false)
  const [open, setOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const guardNavigation = useCallback(
    (action: () => void) => {
      if (!missionInProgress) {
        action()
        return
      }
      setPendingAction(() => action)
      setOpen(true)
    },
    [missionInProgress],
  )

  const value = useMemo(
    () => ({
      missionInProgress,
      setMissionInProgress,
      guardNavigation,
    }),
    [missionInProgress, guardNavigation],
  )

  return (
    <MissionNavigationGuardContext.Provider value={value}>
      {children}
      <MissionLeaveDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          setMissionInProgress(false)
          pendingAction?.()
          setPendingAction(null)
          setOpen(false)
        }}
        onCancel={() => {
          setPendingAction(null)
          setOpen(false)
        }}
      />
    </MissionNavigationGuardContext.Provider>
  )
}

function MissionLeaveDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const { t } = useI18n()

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel()
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("play.leaveMissionTitle")}</DialogTitle>
          <DialogDescription>{t("play.leaveMissionBody")}</DialogDescription>
        </DialogHeader>
        <div className="mt-5 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              {t("common.stayHere")}
            </Button>
          </DialogClose>
          <Button className="flex-1" variant="terracotta" onClick={onConfirm}>
            {t("play.leaveMission")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useMissionNavigationGuard() {
  const context = useContext(MissionNavigationGuardContext)
  if (!context) {
    throw new Error("useMissionNavigationGuard must be used within MissionNavigationGuardProvider")
  }
  return context
}

/** Optional guard for components outside the provider tree (should not happen). */
export function useMissionNavigationGuardOptional() {
  return useContext(MissionNavigationGuardContext)
}
