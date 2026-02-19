import StatusPanel from "./status-panel"
import MapPanel from "./map-panel"
import TimelinePanel from "./timeline-panel"

export default function CommandDashboard() {
  return (
    <div className="grid h-full gap-3 p-3 lg:grid-cols-[260px_1fr_300px]">
      <StatusPanel />
      <MapPanel />
      <TimelinePanel />
    </div>
  )
}
