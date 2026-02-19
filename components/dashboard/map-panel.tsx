"use client"

import { MapPin, Layers, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

function MapToolButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

export default function MapPanel() {
  return (
    <div className="relative flex h-full min-h-[400px] flex-col overflow-hidden rounded-lg border border-border bg-card lg:min-h-0">
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-semibold text-foreground">
          사고 현장 지도
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          37.5665&deg;N, 126.9780&deg;E
        </span>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 bg-[hsl(222,47%,7%)]">
        {/* Grid Pattern Simulation */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(hsl(217,33%,30%) 1px, transparent 1px), linear-gradient(90deg, hsl(217,33%,30%) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Road Lines */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Main roads */}
          <line
            x1="0" y1="200" x2="600" y2="200"
            stroke="hsl(217,33%,25%)" strokeWidth="6"
          />
          <line
            x1="300" y1="0" x2="300" y2="400"
            stroke="hsl(217,33%,25%)" strokeWidth="6"
          />
          <line
            x1="100" y1="0" x2="100" y2="400"
            stroke="hsl(217,33%,20%)" strokeWidth="3"
          />
          <line
            x1="500" y1="0" x2="500" y2="400"
            stroke="hsl(217,33%,20%)" strokeWidth="3"
          />
          <line
            x1="0" y1="100" x2="600" y2="100"
            stroke="hsl(217,33%,20%)" strokeWidth="3"
          />
          <line
            x1="0" y1="300" x2="600" y2="300"
            stroke="hsl(217,33%,20%)" strokeWidth="3"
          />

          {/* Heat pipeline */}
          <line
            x1="150" y1="150" x2="450" y2="250"
            stroke="hsl(38,92%,50%)" strokeWidth="3" strokeDasharray="8 4"
            opacity="0.6"
          />
        </svg>

        {/* Incident Pin */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          {/* Pulse animation */}
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-destructive/20" />
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-destructive/30" />
          {/* Pin */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-destructive bg-destructive/80 shadow-lg shadow-destructive/30">
            <MapPin className="h-5 w-5 text-foreground" />
          </div>
          <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium text-foreground shadow-lg border border-border">
            사고 지점
          </div>
        </div>

        {/* Worker markers */}
        <div className="absolute left-[35%] top-[35%] z-10">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-success bg-success/80 text-[10px] font-bold text-success-foreground">
            A
          </div>
        </div>
        <div className="absolute left-[60%] top-[55%] z-10">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-success bg-success/80 text-[10px] font-bold text-success-foreground">
            B
          </div>
        </div>
        <div className="absolute left-[45%] top-[65%] z-10">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-primary/80 text-[10px] font-bold text-primary-foreground">
            C
          </div>
        </div>

        {/* Map Tools */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
          <MapToolButton icon={ZoomIn} label="확대" />
          <MapToolButton icon={ZoomOut} label="축소" />
          <MapToolButton icon={Layers} label="레이어" />
          <MapToolButton icon={Maximize2} label="전체화면" />
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-20 rounded-md border border-border bg-card/90 p-2.5 backdrop-blur-sm">
          <div className="flex flex-col gap-1.5 text-[10px]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">사고 지점</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-muted-foreground">작업 인원</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 border-t border-dashed border-primary" />
              <span className="text-muted-foreground">열수송관</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
