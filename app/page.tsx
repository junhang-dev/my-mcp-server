"use client"

import { useState } from "react"
import { Monitor, Smartphone, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import GlobalHeader from "@/components/global-header"
import CommandDashboard from "@/components/dashboard/command-dashboard"
import FieldWorkerMode from "@/components/field/field-worker-mode"
import ReportPanel from "@/components/dashboard/report-panel"

type ViewMode = "dashboard" | "field"

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard")
  const [reportOpen, setReportOpen] = useState(false)
  const currentStep = 2

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <GlobalHeader currentStep={currentStep} />

      {/* View Switcher */}
      <div className="flex items-center gap-1 border-b border-border bg-card/50 px-4 py-1.5">
        <button
          onClick={() => setViewMode("dashboard")}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            viewMode === "dashboard"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Monitor className="h-3.5 w-3.5" />
          <span>상황실 대시보드</span>
        </button>
        <button
          onClick={() => setViewMode("field")}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            viewMode === "field"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>현장 작업자 모드</span>
        </button>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReportOpen(true)}
            className="gap-1.5 text-xs text-primary hover:bg-primary/10 hover:text-primary"
          >
            <FileText className="h-3.5 w-3.5" />
            보고서 작성
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        {viewMode === "dashboard" ? (
          <CommandDashboard />
        ) : (
          <FieldWorkerMode />
        )}
      </main>

      {/* Report Panel */}
      <ReportPanel open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
