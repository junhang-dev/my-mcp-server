"use client"

import { MapPin, Clock, User, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2.5",
        color === "primary" && "border-primary/20 bg-primary/5",
        color === "success" && "border-success/20 bg-success/5",
        color === "destructive" && "border-destructive/20 bg-destructive/5"
      )}
    >
      <p className="mb-0.5 text-[11px] font-medium text-muted-foreground">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-mono text-xl font-bold tabular-nums",
            color === "primary" && "text-primary",
            color === "success" && "text-success",
            color === "destructive" && "text-destructive"
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[11px] text-muted-foreground">{unit}</span>
        )}
      </div>
    </div>
  )
}

export default function StatusPanel() {
  return (
    <aside className="flex flex-col gap-3 overflow-y-auto scrollbar-thin">
      {/* Incident Overview */}
      <Card>
        <CardHeader>
          <CardTitle>사고 개요</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <dl className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-destructive/10">
                <MapPin className="h-3.5 w-3.5 text-destructive" />
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] text-muted-foreground">사고 위치</dt>
                <dd className="text-xs font-medium leading-relaxed text-foreground">
                  서울시 마포구 상암동 1234번지
                </dd>
                <dd className="font-mono text-[11px] text-muted-foreground">
                  37.5665&deg;N, 126.9780&deg;E
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10">
                <Clock className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">신고 시간</dt>
                <dd className="font-mono text-xs font-medium text-foreground">
                  2026-02-19 09:32:15
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">현장 책임자</dt>
                <dd className="text-xs font-medium text-foreground">
                  김민수 반장 (열수송1팀)
                </dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="flex flex-col gap-2">
        <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          핵심 지표
        </h2>
        <MetricCard label="현재 조치율" value="42" unit="%" color="primary" />
        <MetricCard label="잔여 시간" value="1:30" unit="hr" color="destructive" />
        <MetricCard label="완료 작업" value="5" unit="/ 12건" color="success" />
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              전체 진행률
            </span>
            <span className="font-mono text-xs font-bold text-primary">42%</span>
          </div>
          <Progress value={42} />
          <div className="mt-2.5 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-[11px] font-medium text-success">정상 진행 중</span>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
