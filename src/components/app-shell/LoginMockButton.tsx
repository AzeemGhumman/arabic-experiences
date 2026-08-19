import { useState } from "react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppState } from "@/lib/app-state"
import { useI18n } from "@/lib/i18n"

export function LoginMockButton() {
  const { t } = useI18n()
  const { state, setMockSignedIn } = useAppState()
  const [open, setOpen] = useState(false)
  const signedIn = state.mockSignedIn

  if (!signedIn) {
    return (
      <button
        type="button"
        onClick={() => setMockSignedIn(true)}
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-paper text-ink-soft transition hover:bg-secondary hover:text-ink active:scale-[0.98]"
        aria-label={t("auth.logIn")}
      >
        <User className="size-4" strokeWidth={2.25} />
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("auth.account")}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-deep text-white transition hover:bg-sage active:scale-[0.98]"
      >
        <User className="size-4" strokeWidth={2.25} />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("auth.account")}</DialogTitle>
            <DialogDescription>{t("auth.mockBody")}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-cream/60 px-3 py-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-deep text-white">
              <User className="size-5" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{t("auth.mockName")}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{t("auth.mockEmail")}</p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            variant="outline"
            onClick={() => {
              setMockSignedIn(false)
              setOpen(false)
            }}
          >
            {t("auth.logOut")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
