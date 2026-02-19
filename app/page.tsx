"use client"

import { useState } from "react"
import { Monitor, Smartphone, FileText } from "lucide-react"
import GlobalHeader from "@/components/global-header"
import CommandDashboard from "@/components/dashboard/command-dashboard"
import FieldWorkerMode from "@/components/field/field-worker-mode"
import ReportPanel from "@/components/dashboard/report-panel"

type ViewMode = "dashboard" | "field"

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard")
  const [reportOpen, setReportOpen] = useState(false)
  const currentStep = 2 // 현재 '굴착' 단계

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <GlobalHeader currentStep={currentStep} />

      {/* View Switcher */}
      <div className="flex items-center gap-1 border-b border-border bg-card px-4 py-2">
        <button
          onClick={() => setViewMode("dashboard")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === "dashboard"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Monitor className="h-4 w-4" />
          <span>상황실 대시보드</span>
        </button>
        <button
          onClick={() => setViewMode("field")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === "field"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>현장 작업자 모드</span>
        </button>

        <div className="ml-auto">
          <button
            onClick={() => setReportOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary/15 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/25"
          >
            <FileText className="h-4 w-4" />
            <span>보고서 작성</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
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
