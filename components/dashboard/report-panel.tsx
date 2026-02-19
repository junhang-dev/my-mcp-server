"use client"

import { useState, useCallback } from "react"
import {
  FileText,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Download,
  RefreshCw,
  ClipboardCopy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

interface ReportPanelProps {
  open: boolean
  onClose: () => void
}

function buildDashboardText(): string {
  const now = new Date()
  const timestamp = now.toISOString().replace("T", " ").substring(0, 19)

  return `[Heat-Sync 사고 대응 보고서 생성 요청]

보고서 생성 시각: ${timestamp}

1. 사고 개요
- 사고 위치: 서울시 마포구 상암동 1234번지 (37.5665\u00B0N, 126.9780\u00B0E)
- 사고 유형: 열수송관 파열
- 사고 등급: Level 1 - 심각
- 신고 시간: 2026-02-19 09:32:15
- 현장 책임자: 김민수 반장 (열수송1팀)

2. 현재 상태
- 현재 단계: 굴착 (전체 6단계 중 3단계)
- 전체 진행률: 42%
- 완료 작업: 5건 / 12건
- 잔여 예상 시간: 1시간 30분
- 투입 인원: 12명
- 진행 상태: 정상 진행 중

3. 대응 타임라인
[09:32] 관제센터 - 사고 접수 완료. 열수송관 파열 신고.
[09:35] 김민수 반장 - 현장 출동 개시. 예상 도착 15분.
[09:48] 김민수 반장 - 현장 도착. 파열 지점 확인 중.
[09:52] 이준혁 - 파열 부위 사진 전송.
[10:01] 김민수 반장 - 굴착 작업 시작. 파열 길이 약 50cm 추정.
[10:15] 박서연 - 굴착 50% 진행. 지반 상태 양호.
[10:28] 이준혁 - 관로 노출 완료. 용접 준비 중.
[10:35] 관제센터 - 추가 자재 배송 출발. ETA 20분.

4. 현장 배치 현황
- 작업조 A: 사고 지점 북서측 배치 (굴착 담당)
- 작업조 B: 사고 지점 남동측 배치 (안전 관리)
- 작업조 C: 사고 지점 남측 배치 (자재 준비)

위 내용을 바탕으로 공식 사고 대응 보고서를 작성해주세요. 보고서에는 사고 개요, 대응 경과, 현재 상황 평가, 향후 조치 계획을 포함해주세요.`
}

type ReportStatus = "idle" | "loading" | "success" | "error"

interface ReportResult {
  file: string | null
  elapsedTime?: number
}

interface ReportError {
  detail: string
  solution: string
}

export default function ReportPanel({ open, onClose }: ReportPanelProps) {
  const [status, setStatus] = useState<ReportStatus>("idle")
  const [result, setResult] = useState<ReportResult | null>(null)
  const [error, setError] = useState<ReportError | null>(null)
  const [copied, setCopied] = useState(false)

  const generateReport = useCallback(async () => {
    setStatus("loading")
    setError(null)
    setResult(null)

    try {
      const text1 = buildDashboardText()
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text1 }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setStatus("error")
        setError({
          detail: data.detail || "알 수 없는 오류가 발생했습니다.",
          solution: data.solution || "잠시 후 다시 시도해주세요.",
        })
        return
      }

      setStatus("success")
      setResult({ file: data.file, elapsedTime: data.elapsedTime })
    } catch {
      setStatus("error")
      setError({
        detail: "네트워크 연결에 실패했습니다.",
        solution: "인터넷 연결을 확인하고 다시 시도해주세요.",
      })
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (result?.file) {
      try {
        await navigator.clipboard.writeText(result.file)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // clipboard API not available
      }
    }
  }, [result])

  const handleDownload = useCallback(() => {
    if (!result?.file) return

    if (result.file.startsWith("http://") || result.file.startsWith("https://")) {
      const link = document.createElement("a")
      link.href = result.file
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.download = ""
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    const now = new Date()
    const dateStr = now.toISOString().replace(/T/, "_").replace(/:/g, "").substring(0, 15)
    const filename = `사고대응보고서_${dateStr}.txt`
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + result.file], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [result])

  const handleReset = useCallback(() => {
    setStatus("idle")
    setResult(null)
    setError(null)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                사고 대응 보고서 생성
              </h2>
              <p className="text-[11px] text-muted-foreground">
                MISO AI 기반 자동 보고서 작성
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Idle State */}
          {status === "idle" && (
            <div className="flex flex-col items-center gap-5 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  대시보드의 현재 데이터를 기반으로 보고서를 자동 생성합니다.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  사고 개요, 대응 경과, 타임라인, 현장 배치 정보가 포함됩니다.
                </p>
              </div>

              <Card className="w-full bg-muted/30">
                <CardContent className="p-3.5">
                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    포함 데이터
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      "사고 개요 (위치, 유형, 등급, 시간, 담당자)",
                      "현재 진행 상태 (단계, 진행률, 인원)",
                      "대응 타임라인 (8건의 실시간 로그)",
                      "현장 배치 현황 (작업조 A/B/C)",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
                        <span className="text-xs text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={generateReport} className="w-full gap-2">
                <FileText className="h-4 w-4" />
                보고서 생성하기
              </Button>
            </div>
          )}

          {/* Loading State */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-5 py-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  보고서를 생성하고 있습니다...
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  MISO AI가 대시보드 데이터를 분석 중입니다
                </p>
              </div>
              <div className="w-full max-w-xs">
                <Progress value={60} className="h-1" />
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && result && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3 rounded-md border border-success/20 bg-success/5 px-4 py-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-success">
                    보고서가 생성되었습니다
                  </p>
                  {result.elapsedTime && (
                    <p className="text-[11px] text-success/70">
                      소요 시간: {result.elapsedTime.toFixed(1)}초
                    </p>
                  )}
                </div>
              </div>

              {result.file && (
                <Card className="overflow-hidden bg-muted/20">
                  <div className="flex items-center justify-between border-b border-border px-3.5 py-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      생성된 보고서
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 px-2 text-[11px]"
                        onClick={handleCopy}
                      >
                        <ClipboardCopy className="h-3 w-3" />
                        {copied ? "복사됨" : "복사"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 px-2 text-[11px]"
                        onClick={handleDownload}
                      >
                        <Download className="h-3 w-3" />
                        저장
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="max-h-[40vh]">
                    <div className="p-3.5">
                      <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground">
                        {result.file}
                      </pre>
                    </div>
                  </ScrollArea>
                </Card>
              )}

              {result.file && (
                <Button onClick={handleDownload} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  보고서 파일 다운로드
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                다시 생성하기
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && error && (
            <div className="flex flex-col items-center gap-5 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <Card className="w-full border-destructive/20 bg-destructive/5">
                <CardContent className="p-3.5">
                  <p className="text-sm font-medium text-destructive">
                    {error.detail}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">해결 방안:</span>{" "}
                    {error.solution}
                  </p>
                </CardContent>
              </Card>
              <div className="flex w-full gap-2.5">
                <Button onClick={generateReport} className="flex-1 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  다시 시도
                </Button>
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  돌아가기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
