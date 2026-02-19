"use client"

import { MapPin, Clock, User, TrendingUp } from "lucide-react"

function MetricCard({
  label,
  value,
  unit,
  color,
}: {
  label: string
  value: string
  unit?: string
  color: "primary" | "success" | "destructive"
}) {
  const colorClasses = {
    primary: "text-primary border-primary/30 bg-primary/5",
    success: "text-success border-success/30 bg-success/5",
    destructive: "text-destructive border-destructive/30 bg-destructive/5",
  }

  return (
    <div
      className={`rounded-lg border p-4 ${colorClasses[color]}`}
    >
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-2xl font-bold tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground">{unit}</span>
        )}
      </div>
    </div>
  )
}

export default function StatusPanel() {
  return (
    <aside className="flex flex-col gap-4">
      {/* Incident Overview */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          사고 개요
        </h2>
        <dl className="flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <dt className="text-xs text-muted-foreground">사고 위치</dt>
              <dd className="text-sm font-medium text-foreground">
                서울시 마포구 상암동 1234번지
              </dd>
              <dd className="font-mono text-xs text-muted-foreground">
                37.5665&deg;N, 126.9780&deg;E
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">신고 시간</dt>
              <dd className="font-mono text-sm font-medium text-foreground">
                2026-02-19 09:32:15
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">현장 책임자</dt>
              <dd className="text-sm font-medium text-foreground">
                김민수 반장 (열수송1팀)
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Key Metrics */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">핵심 지표</h2>
        <MetricCard label="현재 조치율" value="42" unit="%" color="primary" />
        <MetricCard label="잔여 시간" value="1:30" unit="hr" color="destructive" />
        <MetricCard label="완료 작업" value="5" unit="/ 12건" color="success" />
      </div>

      {/* Progress Bar */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            전체 진행률
          </span>
          <span className="font-mono text-xs font-bold text-primary">42%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: "42%" }}
          />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-success" />
          <span className="text-xs text-success">정상 진행 중</span>
        </div>
      </div>
    </aside>
  )
}
