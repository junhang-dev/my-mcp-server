"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, MessageSquare, AlertTriangle, CheckCircle2, Wrench } from "lucide-react"

interface LogItem {
  id: number
  time: string
  author: string
  content: string
  type: "photo" | "text" | "alert" | "complete" | "action"
}

const INITIAL_LOGS: LogItem[] = [
  {
    id: 1,
    time: "09:32",
    author: "관제센터",
    content: "사고 접수 완료. 열수송관 파열 신고.",
    type: "alert",
  },
  {
    id: 2,
    time: "09:35",
    author: "김민수 반장",
    content: "현장 출동 개시. 예상 도착 15분.",
    type: "action",
  },
  {
    id: 3,
    time: "09:48",
    author: "김민수 반장",
    content: "현장 도착. 파열 지점 확인 중.",
    type: "complete",
  },
  {
    id: 4,
    time: "09:52",
    author: "이준혁",
    content: "파열 부위 사진 전송.",
    type: "photo",
  },
  {
    id: 5,
    time: "10:01",
    author: "김민수 반장",
    content: "굴착 작업 시작. 파열 길이 약 50cm 추정.",
    type: "action",
  },
  {
    id: 6,
    time: "10:15",
    author: "박서연",
    content: "굴착 50% 진행. 지반 상태 양호.",
    type: "text",
  },
  {
    id: 7,
    time: "10:28",
    author: "이준혁",
    content: "관로 노출 완료. 용접 준비 중.",
    type: "photo",
  },
  {
    id: 8,
    time: "10:35",
    author: "관제센터",
    content: "추가 자재 배송 출발. ETA 20분.",
    type: "text",
  },
]

const LIVE_LOGS: LogItem[] = [
  {
    id: 9,
    time: "10:42",
    author: "김민수 반장",
    content: "용접 작업 개시. 현장 안전 확인 완료.",
    type: "action",
  },
  {
    id: 10,
    time: "10:55",
    author: "박서연",
    content: "용접 진행 사진 전송.",
    type: "photo",
  },
  {
    id: 11,
    time: "11:08",
    author: "이준혁",
    content: "용접 70% 완료. 누수 테스트 준비 중.",
    type: "text",
  },
]

const iconMap = {
  photo: Camera,
  text: MessageSquare,
  alert: AlertTriangle,
  complete: CheckCircle2,
  action: Wrench,
}

const iconColorMap = {
  photo: "text-primary",
  text: "text-muted-foreground",
  alert: "text-destructive",
  complete: "text-success",
  action: "text-primary",
}

function TimelineItem({ log }: { log: LogItem }) {
  const Icon = iconMap[log.type]
  const iconColor = iconColorMap[log.type]

  return (
    <div className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
      <div className={`mt-0.5 shrink-0 ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span className="font-mono text-xs text-primary">{log.time}</span>
          <span className="text-xs font-medium text-foreground">
            {log.author}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {log.content}
        </p>
        {log.type === "photo" && (
          <div className="mt-2 h-20 w-full rounded-md border border-border bg-muted/50 flex items-center justify-center">
            <Camera className="h-5 w-5 text-muted-foreground/50" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function TimelinePanel() {
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS)
  const scrollRef = useRef<HTMLDivElement>(null)
  const liveIndexRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (liveIndexRef.current < LIVE_LOGS.length) {
        setLogs((prev) => [LIVE_LOGS[liveIndexRef.current], ...prev])
        liveIndexRef.current++
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [logs])

  return (
    <aside className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-semibold text-foreground">
          실시간 타임라인
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-xs text-success">Live</span>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div className="divide-y divide-border">
          {logs.map((log) => (
            <TimelineItem key={log.id} log={log} />
          ))}
        </div>
      </div>
    </aside>
  )
}
