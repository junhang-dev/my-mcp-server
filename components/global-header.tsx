"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Users, Clock } from "lucide-react"

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
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-primary" />
      <span className="text-xs text-muted-foreground">ETA</span>
      <span className="font-mono text-sm font-bold tabular-nums text-primary">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(secs).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function GlobalHeader({ currentStep }: GlobalHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-border bg-card px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
      {/* Left: Logo + Incident Level */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-lg font-bold text-foreground">Heat-Sync</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-destructive/15 px-2.5 py-1">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          <span className="text-xs font-semibold text-destructive">
            Level 1 - 심각
          </span>
        </div>
      </div>

      {/* Center: Step Indicator */}
      <nav className="flex items-center gap-1" aria-label="사고 대응 단계">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <div key={step} className="flex items-center gap-1">
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isCompleted
                    ? "bg-success/20 text-success"
                    : isCurrent
                      ? "bg-primary/20 text-primary ring-1 ring-primary/50"
                      : "bg-muted text-muted-foreground"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "\u2713" : index + 1}
                </span>
                <span className="hidden sm:inline">{step}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-px w-3 lg:w-5 ${
                    isCompleted ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          )
        })}
      </nav>

      {/* Right: ETA + Personnel */}
      <div className="flex items-center gap-4">
        <ETATimer />
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">투입 인원</span>
          <span className="font-mono text-sm font-bold tabular-nums text-foreground">
            12명
          </span>
        </div>
      </div>
    </header>
  )
}
