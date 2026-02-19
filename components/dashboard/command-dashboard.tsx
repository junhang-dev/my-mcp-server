import StatusPanel from "./status-panel"
import MapPanel from "./map-panel"
import TimelinePanel from "./timeline-panel"

export default function CommandDashboard() {
  return (
    <div className="grid h-full gap-4 p-4 lg:grid-cols-[280px_1fr_320px]">
      <StatusPanel />
      <MapPanel />
      <TimelinePanel />
    </div>
  )
}
