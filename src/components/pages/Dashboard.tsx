import { ChevronRight, FileVideo, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardStore } from "../../store/dashboardStore";
import { UploadZone } from "../UploadZone";
import type { DashboardStats, Scan } from "../../types";

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 text-center">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-red-400" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Total Scans" value={stats.totalScans >= 1000 ? `${(stats.totalScans / 1000).toFixed(1)}k` : String(stats.totalScans)} />
      <StatCard label="Fake Detected" value={String(stats.fakeDetected)} highlight />
      <StatCard label="Accuracy" value={`${stats.accuracy}%`} />
    </div>
  );
}

function ScanItem({ scan, onClick }: { scan: Scan; onClick?: () => void }) {
  const isScanning = scan.status === "SCANNING";

  return (
    <div
      onClick={!isScanning ? onClick : undefined}
      className={`bg-card border border-border rounded-lg p-4 flex items-center gap-4 transition-colors ${
        !isScanning ? "cursor-pointer hover:bg-muted/20" : ""
      }`}
    >
      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center shrink-0 relative">
        <FileVideo size={20} className="text-muted-foreground" />
        {!isScanning && (
          <span className={`absolute bottom-0 left-0 text-[10px] font-bold px-1 rounded-sm ${
            scan.status === "FAKE" ? "bg-red-500 text-white" : "bg-green-600 text-white"
          }`}>
            {scan.status === "FAKE" ? "FAKE" : "SAFE"}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{scan.filename}</p>
        <p className="text-xs text-muted-foreground">{scan.label} · {scan.timestamp}</p>
      </div>
      {isScanning
        ? <Loader2 size={18} className="text-primary animate-spin shrink-0" />
        : <ChevronRight size={18} className="text-muted-foreground shrink-0" />
      }
    </div>
  );
}

export function Dashboard() {
  const { stats, recentScans } = useDashboardStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto md:max-w-none space-y-6">
      <StatsRow stats={stats} />
      <UploadZone />
      {recentScans.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Recent Investigations</h2>
            <Link to="/history" className="text-xs text-primary hover:underline">
              View History
            </Link>
          </div>
          <div className="space-y-2">
            {recentScans.map((scan) => (
              <ScanItem
                key={scan.id}
                scan={scan}
                onClick={() => navigate(`/detection?id=${scan.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
