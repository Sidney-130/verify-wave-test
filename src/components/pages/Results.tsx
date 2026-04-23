import { AlertTriangle, CheckCircle, Download, FileText, ScanSearch } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useScanStore } from "../../store/scanStore";
import { useDashboardStore } from "../../store/dashboardStore";

export function Results() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const fromHistory = useScanStore((s) => s.getScan)(id ?? "");
  const fromDashboard = useDashboardStore((s) => s.recentScans.find((r) => r.id === id));

  const scan = fromHistory ?? (fromDashboard?.status !== "SCANNING" ? fromDashboard : undefined);

  if (!scan) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <ScanSearch size={40} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No scan results yet. Upload a file from the Dashboard to begin.</p>
      </div>
    );
  }

  const isFake = scan.status === "FAKE";

  return (
    <div className="max-w-2xl mx-auto md:max-w-none space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Results</h1>
        <p className="text-sm text-muted-foreground mt-1">Latest analysis from the deepfake detection engine.</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Security Verdict</span>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-2xl font-bold ${isFake ? "text-red-400" : "text-green-400"}`}>
                {isFake ? "Fake Detected" : "Authentic"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{scan.filename}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
              <p className="text-3xl font-bold text-primary">{scan.confidence}%</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              isFake ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"
            }`}>
              {isFake ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
              {isFake ? "Critical" : "Clear"}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              isFake ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}>
              {isFake ? "Compromised" : "Intact"}
            </span>
          </div>

          {"breakdown" in scan && scan.breakdown.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Manipulation Breakdown</p>
              <div className="space-y-3">
                {scan.breakdown.map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <span className="text-sm text-foreground flex-1 min-w-0 truncate">{b.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 md:w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${b.match}%` }} />
                      </div>
                      <span className="text-xs text-red-400 font-semibold w-14 text-right">{b.match}% match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText size={12} /> Digital Metadata
            </p>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>FILE: {scan.filename}</p>
              <p>STATUS: {scan.status}</p>
              <p>CONFIDENCE: {scan.confidence}%</p>
              {"date" in scan && <p>DATE: {scan.date}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/75 transition-colors flex items-center justify-center gap-2 text-sm">
              <Download size={16} /> Download Result
            </button>
            <button className="flex-1 border border-border text-foreground font-semibold py-3 rounded-lg hover:bg-muted/40 transition-colors flex items-center justify-center gap-2 text-sm">
              <FileText size={16} /> Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
