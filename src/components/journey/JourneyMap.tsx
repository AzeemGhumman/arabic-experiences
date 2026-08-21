import { Fragment } from "react"
import { Link } from "react-router-dom"
import { JourneyNode } from "@/components/journey/JourneyNode"
import { useI18n } from "@/lib/i18n"
import type { UmrahStep } from "@/lib/storage"
import { cn } from "@/lib/utils"

export function JourneyMap({ steps }: { steps: UmrahStep[] }) {
  const { t } = useI18n()

  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute top-6 bottom-6 start-[21px] w-px bg-linear-to-b from-sage via-gold-soft to-border" />
      <ol className="relative space-y-5">
        {steps.map((step, index) => {
          const copy = t(`companion.steps.${step.id}.title`)
          const title = copy.startsWith("companion.steps.") ? step.title : copy
          const subPath = t(`companion.steps.${step.id}.subtitle`)
          const subtitle = subPath.startsWith("companion.steps.") ? step.subtitle : subPath
          const inner = <JourneyNode title={title} subtitle={subtitle} status="not-started" index={index} />
          return (
            <Fragment key={step.id}>
              <li className={cn("relative", step.href && "z-10")}>
                {step.href ? (
                  <Link to={step.href} className="block">
                    {inner}
                    <p className="ps-[3.75rem] pt-1 text-xs font-semibold text-terracotta">
                      {t("companion.openSheet")}
                    </p>
                  </Link>
                ) : (
                  inner
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </div>
  )
}
