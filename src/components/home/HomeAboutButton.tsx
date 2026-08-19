import { useState } from "react"
import { HomeAbout } from "@/components/home/HomeAbout"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n"

export function HomeAboutButton({ variant = "pill" }: { variant?: "pill" | "icon" }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("homeAbout.openHelp")}
        className={
          variant === "icon"
            ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-deep text-white transition hover:bg-sage active:scale-[0.98]"
            : "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sage-deep px-2.5 py-1 text-white shadow-sm transition hover:bg-sage active:scale-[0.98]"
        }
      >
        <span className="font-display text-[15px] leading-none font-semibold italic">i</span>
        {variant === "pill" ? (
          <span className="text-[11px] font-semibold tracking-wide">{t("homeAbout.about")}</span>
        ) : null}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[min(88dvh,40rem)] flex-col overflow-hidden p-0">
          <DialogHeader className="shrink-0 px-6 pt-6 pe-12 pb-0">
            <DialogTitle>{t("homeAbout.dialogTitle")}</DialogTitle>
            <DialogDescription className="sr-only">{t("homeAbout.openHelp")}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto px-6 pt-4 pb-6">
            <HomeAbout onSelectTab={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
