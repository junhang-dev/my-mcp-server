"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Camera,
  Mic,
  HardHat,
  CheckCircle2,
  Phone,
  MapPin,
  Navigation,
} from "lucide-react"

function CameraOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold text-foreground">
          사진 촬영
        </span>
        <button
          onClick={onClose}
          className="rounded-md px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          닫기
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center bg-[hsl(222,47%,5%)]">
        {/* Viewfinder */}
        <div className="h-64 w-64 rounded-lg border-2 border-foreground/30">
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-foreground/50" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-foreground/50" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center border-t border-border px-4 py-6">
        <button
          onClick={onClose}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-foreground/30 bg-foreground transition-transform active:scale-90"
          aria-label="촬영"
        >
          <div className="h-12 w-12 rounded-full bg-foreground" />
        </button>
      </div>
    </div>
  )
}

function VoiceOverlay({ onClose }: { onClose: () => void }) {
  const [isRecording, setIsRecording] = useState(true)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold text-foreground">
          음성 보고
        </span>
        <button
          onClick={onClose}
          className="rounded-md px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          닫기
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        {/* Waveform Animation */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full ${isRecording ? "bg-destructive" : "bg-muted-foreground/30"}`}
              style={{
                height: isRecording ? `${Math.random() * 40 + 8}px` : "8px",
                animation: isRecording
                  ? `wave ${0.3 + Math.random() * 0.4}s ease-in-out infinite alternate`
                  : "none",
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {isRecording ? "듣고 있습니다..." : "처리 중..."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRecording
              ? "음성 보고를 말씀하세요"
              : "음성을 텍스트로 변환 중"}
          </p>
        </div>

        {/* STT Preview */}
        {isRecording && (
          <div className="mx-6 w-full max-w-sm rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">인식 중...</p>
            <p className="mt-1 text-sm text-foreground">
              {"용접 작업 70% 진행 중이며 현장 안전 상태는..."}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center border-t border-border px-4 py-6">
        <button
          onClick={() => {
            if (isRecording) {
              setIsRecording(false)
              setTimeout(onClose, 1500)
            }
          }}
          className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform active:scale-90 ${
            isRecording
              ? "bg-destructive shadow-lg shadow-destructive/30"
              : "bg-muted"
          }`}
          aria-label={isRecording ? "녹음 중지" : "처리 중"}
        >
          {isRecording ? (
            <div className="h-6 w-6 rounded-sm bg-foreground" />
          ) : (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
          )}
        </button>
      </div>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  color,
  onClick,
  isToggle,
  isToggled,
  isLongPress,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  onClick: () => void
  isToggle?: boolean
  isToggled?: boolean
  isLongPress?: boolean
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pressing, setPressing] = useState(false)
  const [pressProgress, setPressProgress] = useState(0)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handlePressStart = useCallback(() => {
    if (isLongPress) {
      setPressing(true)
      setPressProgress(0)
      const startTime = Date.now()
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / 1500) * 100, 100)
        setPressProgress(progress)
      }, 16)
      timerRef.current = setTimeout(() => {
        onClick()
        setPressing(false)
        setPressProgress(0)
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      }, 1500)
    }
  }, [isLongPress, onClick])

  const handlePressEnd = useCallback(() => {
    if (isLongPress) {
      setPressing(false)
      setPressProgress(0)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [isLongPress])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  const colorClasses: Record<string, string> = {
    primary: isToggled
      ? "bg-primary text-primary-foreground ring-2 ring-primary"
      : "border-primary/40 bg-primary/10 text-primary active:bg-primary active:text-primary-foreground",
    destructive:
      "border-destructive/40 bg-destructive/10 text-destructive active:bg-destructive active:text-foreground",
    success: isToggled
      ? "bg-success text-success-foreground ring-2 ring-success"
      : "border-success/40 bg-success/10 text-success active:bg-success active:text-success-foreground",
    amber:
      "border-primary/40 bg-primary/10 text-primary active:bg-primary active:text-primary-foreground",
  }

  return (
    <button
      className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border p-6 text-center transition-all active:scale-95 ${
        pressing ? "ring-2 ring-primary scale-95" : ""
      } ${colorClasses[color] || colorClasses.primary}`}
      onClick={!isLongPress ? onClick : undefined}
      onMouseDown={isLongPress ? handlePressStart : undefined}
      onMouseUp={isLongPress ? handlePressEnd : undefined}
      onMouseLeave={isLongPress ? handlePressEnd : undefined}
      onTouchStart={isLongPress ? handlePressStart : undefined}
      onTouchEnd={isLongPress ? handlePressEnd : undefined}
    >
      {isLongPress && pressing && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-success transition-none"
          style={{ width: `${pressProgress}%` }}
        />
      )}
      <Icon className="h-10 w-10" />
      <span className="text-sm font-bold">{label}</span>
      {isToggle && (
        <span className="text-xs opacity-70">
          {isToggled ? "진행 중" : "시작하려면 탭"}
        </span>
      )}
      {isLongPress && (
        <span className="text-xs opacity-70">
          {pressing ? "계속 누르세요..." : "길게 눌러서 확인"}
        </span>
      )}
    </button>
  )
}

export default function FieldWorkerMode() {
  const [showCamera, setShowCamera] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [isDigging, setIsDigging] = useState(false)
  const [isArrived, setIsArrived] = useState(false)
  const [actionCompleted, setActionCompleted] = useState(false)

  if (showCamera) return <CameraOverlay onClose={() => setShowCamera(false)} />
  if (showVoice) return <VoiceOverlay onClose={() => setShowVoice(false)} />

  return (
    <div className="relative mx-auto flex h-full max-w-md flex-col">
      {/* Top: GPS Location + Arrival */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">현재 위치</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-destructive" />
          <span className="font-mono text-sm text-foreground">
            37.5665&deg;N, 126.9780&deg;E
          </span>
        </div>
        <button
          onClick={() => setIsArrived(!isArrived)}
          className={`w-full rounded-xl py-4 text-base font-bold transition-all active:scale-[0.98] ${
            isArrived
              ? "bg-success text-success-foreground"
              : "border border-success/40 bg-success/10 text-success"
          }`}
        >
          {isArrived ? "현장 도착 완료" : "현장 도착 확인"}
        </button>
      </div>

      {/* Center: Quick Action Grid */}
      <div className="flex-1 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          빠른 조치
        </p>
        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            icon={Camera}
            label="사진 촬영"
            color="primary"
            onClick={() => setShowCamera(true)}
          />
          <ActionButton
            icon={Mic}
            label="음성 보고"
            color="destructive"
            onClick={() => setShowVoice(true)}
          />
          <ActionButton
            icon={HardHat}
            label="굴착 시작"
            color="amber"
            isToggle
            isToggled={isDigging}
            onClick={() => setIsDigging(!isDigging)}
          />
          <ActionButton
            icon={CheckCircle2}
            label="조치 완료"
            color="success"
            isLongPress
            onClick={() => setActionCompleted(true)}
          />
        </div>

        {actionCompleted && (
          <div className="mt-4 rounded-lg border border-success/30 bg-success/10 p-4 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" />
            <p className="text-sm font-semibold text-success">
              조치 완료가 보고되었습니다
            </p>
          </div>
        )}
      </div>

      {/* SOS Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-destructive shadow-lg shadow-destructive/40 transition-transform active:scale-90"
          aria-label="긴급 호출 SOS"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-20" />
          <Phone className="h-7 w-7 text-foreground" />
        </button>
        <span className="mt-1 block text-center text-[10px] font-bold text-destructive">
          SOS
        </span>
      </div>
    </div>
  )
}
