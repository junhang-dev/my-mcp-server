"use client"

import { MapPin, Layers, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function MapPanel() {
  return (
    <Card className="relative flex h-full min-h-[400px] flex-col overflow-hidden lg:min-h-0">
      {/* Map Header */}
      <CardHeader className="flex-row items-center justify-between py-2.5">
        <CardTitle>사고 현장 지도</CardTitle>
        <span className="font-mono text-[11px] text-muted-foreground">
          37.5665&deg;N, 126.9780&deg;E
        </span>
      </CardHeader>

      {/* Map Area */}
      <div className="relative flex-1 bg-background">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(220,13%,30%) 1px, transparent 1px), linear-gradient(90deg, hsl(220,13%,30%) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Road Lines */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <line x1="0" y1="200" x2="600" y2="200" stroke="hsl(220,13%,22%)" strokeWidth="6" />
          <line x1="300" y1="0" x2="300" y2="400" stroke="hsl(220,13%,22%)" strokeWidth="6" />
          <line x1="100" y1="0" x2="100" y2="400" stroke="hsl(220,13%,18%)" strokeWidth="3" />
          <line x1="500" y1="0" x2="500" y2="400" stroke="hsl(220,13%,18%)" strokeWidth="3" />
          <line x1="0" y1="100" x2="600" y2="100" stroke="hsl(220,13%,18%)" strokeWidth="3" />
          <line x1="0" y1="300" x2="600" y2="300" stroke="hsl(220,13%,18%)" strokeWidth="3" />
          {/* Heat pipeline */}
          <line
            x1="150" y1="150" x2="450" y2="250"
            stroke="hsl(36,80%,50%)" strokeWidth="2.5" strokeDasharray="8 4"
            opacity="0.5"
          />
        </svg>

        {/* Incident Pin */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-destructive/15" />
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-destructive/25" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-destructive bg-destructive/90 shadow-lg shadow-destructive/20">
            <MapPin className="h-4 w-4 text-destructive-foreground" />
          </div>
          <div className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-1 text-[11px] font-medium text-foreground shadow-lg ring-1 ring-border">
            사고 지점
          </div>
        </div>

        {/* Worker markers */}
        {[
          { id: "A", left: "35%", top: "35%", color: "success" },
          { id: "B", left: "60%", top: "55%", color: "success" },
          { id: "C", left: "45%", top: "65%", color: "primary" },
        ].map((worker) => (
          <div
            key={worker.id}
            className="absolute z-10"
            style={{ left: worker.left, top: worker.top }}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shadow-md ${
                worker.color === "success"
                  ? "border border-success/50 bg-success text-success-foreground"
                  : "border border-primary/50 bg-primary text-primary-foreground"
              }`}
            >
              {worker.id}
            </div>
          </div>
        ))}

        {/* Map Tools */}
        <div className="absolute right-2.5 top-2.5 z-20 flex flex-col gap-1">
          {[
            { icon: ZoomIn, label: "확대" },
            { icon: ZoomOut, label: "축소" },
            { icon: Layers, label: "레이어" },
            { icon: Maximize2, label: "전체화면" },
          ].map(({ icon: Icon, label }) => (
            <Button
              key={label}
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-card/90 backdrop-blur-sm"
              aria-label={label}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-2.5 left-2.5 z-20 rounded-md bg-card/90 p-2.5 ring-1 ring-border backdrop-blur-sm">
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
    </Card>
  )
}
