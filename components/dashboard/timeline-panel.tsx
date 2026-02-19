"use client"

import { useEffect, useRef, useState } from "react"
import {
  Camera,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LogItem {
  id: number
  time: string
  author: string
  content: string
  type: "photo" | "text" | "alert" | "complete" | "action"
}

const INITIAL_LOGS: LogItem[] = [
  { id: 1, time: "09:32", author: "관제센터", content: "사고 접수 완료. 열수송관 파열 신고.", type: "alert" },
  { id: 2, time: "09:35", author: "김민수 반장", content: "현장 출동 개시. 예상 도착 15분.", type: "action" },
  { id: 3, time: "09:48", author: "김민수 반장", content: "현장 도착. 파열 지점 확인 중.", type: "complete" },
  { id: 4, time: "09:52", author: "이준혁", content: "파열 부위 사진 전송.", type: "photo" },
  { id: 5, time: "10:01", author: "김민수 반장", content: "굴착 작업 시작. 파열 길이 약 50cm 추정.", type: "action" },
  { id: 6, time: "10:15", author: "박서연", content: "굴착 50% 진행. 지반 상태 양호.", type: "text" },
  { id: 7, time: "10:28", author: "이준혁", content: "관로 노출 완료. 용접 준비 중.", type: "photo" },
  { id: 8, time: "10:35", author: "관제센터", content: "추가 자재 배송 출발. ETA 20분.", type: "text" },
]

const LIVE_LOGS: LogItem[] = [
  { id: 9, time: "10:42", author: "김민수 반장", content: "용접 작업 개시. 현장 안전 확인 완료.", type: "action" },
  { id: 10, time: "10:55", author: "박서연", content: "용접 진행 사진 전송.", type: "photo" },
  { id: 11, time: "11:08", author: "이준혁", content: "용접 70% 완료. 누수 테스트 준비 중.", type: "text" },
]

const iconMap = {
  photo: Camera,
  text: MessageSquare,
  alert: AlertTriangle,
  complete: CheckCircle2,
  action: Wrench,
}

const iconColorMap = {
  photo: "text-primary bg-primary/10",
  text: "text-muted-foreground bg-muted",
  alert: "text-destructive bg-destructive/10",
  complete: "text-success bg-success/10",
  action: "text-primary bg-primary/10",
}

function TimelineItem({ log }: { log: LogItem }) {
  const Icon = iconMap[log.type]
  const iconColor = iconColorMap[log.type]

  return (
    <div className="flex gap-2.5 px-3 py-2.5 transition-colors hover:bg-muted/30">
      <div
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded",
          iconColor
        )}
      >
        <Icon className="h-3 w-3" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="font-mono text-[11px] font-medium text-primary">
            {log.time}
          </span>
          <span className="text-[11px] font-medium text-foreground">
            {log.author}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {log.content}
        </p>
        {log.type === "photo" && (
          <div className="mt-1.5 flex h-16 w-full items-center justify-center rounded border border-border bg-muted/30">
            <Camera className="h-4 w-4 text-muted-foreground/40" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function TimelinePanel() {
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS)
  const liveIndexRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = liveIndexRef.current
      if (idx < LIVE_LOGS.length) {
        const nextLog = LIVE_LOGS[idx]
        if (nextLog) {
          liveIndexRef.current = idx + 1
          setLogs((prev) => [nextLog, ...prev])
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex-row items-center justify-between py-2.5">
        <CardTitle>실시간 타임라인</CardTitle>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[11px] font-medium text-success">Live</span>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1" style={{ maxHeight: "calc(100vh - 180px)" }}>
        <div className="divide-y divide-border/50">
          {logs.filter(Boolean).map((log) => (
            <TimelineItem key={log.id} log={log} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
