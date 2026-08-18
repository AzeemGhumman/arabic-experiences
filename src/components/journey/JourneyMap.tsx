import { Fragment } from "react"
import { Link } from "react-router-dom"
import { JourneyNode } from "@/components/journey/JourneyNode"
import type { UmrahStep } from "@/lib/storage"
import { cn } from "@/lib/utils"

export function JourneyMap({ steps }: { steps: UmrahStep[] }) {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute top-6 bottom-6 start-[21px] w-px bg-linear-to-b from-sage via-gold-soft to-border" />
      <ol className="relative space-y-5">
        {steps.map((step, index) => {
          const inner = (
            <JourneyNode title={step.title} subtitle={step.subtitle} status="not-started" index={index} />
          )
          return (
            <Fragment key={step.id}>
              <li className={cn("relative", step.href && "z-10")}>
                {step.href ? (
                  <Link to={step.href} className="block">
                    {inner}
                    <p className="ps-[3.75rem] pt-1 text-xs font-semibold text-terracotta">Open sheet</p>
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
