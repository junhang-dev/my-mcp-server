"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const STEPS = ["접수", "출동", "굴착", "용접", "복구", "완료"] as const

interface GlobalHeaderProps {
  currentStep: number
}

function ETATimer() {
  const [seconds, setSeconds] = useState(5400)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5">
      <Clock className="h-3.5 w-3.5 text-primary" />
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        ETA
      </span>
      <span className="font-mono text-sm font-bold tabular-nums text-primary">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(secs).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function GlobalHeader({ currentStep }: GlobalHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-border bg-card px-4 py-2.5 lg:flex-row lg:items-center lg:justify-between lg:px-5">
      {/* Left: Logo + Incident Level */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Heat-Sync
          </span>
        </div>
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Level 1 - 심각
        </Badge>
      </div>

      {/* Center: Step Indicator */}
      <nav className="flex items-center gap-0.5" aria-label="사고 대응 단계">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <div key={step} className="flex items-center gap-0.5">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  isCompleted && "bg-success/15 text-success",
                  isCurrent && "bg-primary/15 text-primary ring-1 ring-primary/40",
                  !isCompleted && !isCurrent && "text-muted-foreground"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? "\u2713" : index + 1}
                </span>
                <span className="hidden sm:inline">{step}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px w-3 lg:w-4",
                    isCompleted ? "bg-success/50" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </nav>

      {/* Right: ETA + Personnel */}
      <div className="flex items-center gap-3">
        <ETATimer />
        <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            투입
          </span>
          <span className="font-mono text-sm font-bold tabular-nums text-foreground">
            12명
          </span>
        </div>
      </div>
    </header>
  )
}
