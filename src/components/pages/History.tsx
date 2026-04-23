import { useState } from "react";
import { FileVideo, ExternalLink, Trash2, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScanStore } from "../../store/scanStore";
import type { HistoryScan } from "../../store/scanStore";

type Filter = "ALL" | "FAKE" | "AUTHENTIC";

function StatusBadge({ status }: { status: "FAKE" | "AUTHENTIC" | "SCANNING" }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
      status === "FAKE"
        ? "bg-red-500/20 text-red-400 border border-red-500/30"
        : "bg-green-500/20 text-green-400 border border-green-500/30"
    }`}>
      {status === "FAKE" ? "Deepfake" : "Authentic"}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-primary font-semibold">{value}%</span>
    </div>
  );
}

function ScanRow({ scan, onView, onDelete }: { scan: HistoryScan; onView: () => void; onDelete: () => void }) {
  return (
    <>
      <tr className="hidden md:table-row border-b border-border hover:bg-muted/20 transition-colors">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <FileVideo size={16} className="text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground font-medium truncate max-w-[220px]">{scan.filename}</span>
          </div>
        </td>
        <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">{scan.date}</td>
        <td className="px-4 py-4"><StatusBadge status={scan.status} /></td>
        <td className="px-4 py-4"><ConfidenceBar value={scan.confidence} /></td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <button onClick={onView} className="text-xs text-foreground border border-border px-3 py-1 rounded hover:bg-muted/40 transition-colors">View</button>
            <button onClick={onDelete} className="text-xs text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
          </div>
        </td>
      </tr>

      <div className="md:hidden bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center shrink-0">
            <FileVideo size={18} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{scan.filename}</p>
            <p className="text-xs text-muted-foreground">{scan.date}</p>
          </div>
          <button onClick={onView} className="text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={scan.status} />
          <div className="flex items-center gap-3">
            <ConfidenceBar value={scan.confidence} />
            <button onClick={onDelete} className="text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function History() {
  const { scans, deleteScan } = useScanStore();
  const [filter, setFilter] = useState<Filter>("ALL");
  const navigate = useNavigate();

  const filtered = scans.filter((s) => {
    if (filter === "FAKE") return s.status === "FAKE";
    if (filter === "AUTHENTIC") return s.status === "AUTHENTIC";
    return true;
  });

  const filters: { label: string; value: Filter }[] = [
    { label: "All Logs", value: "ALL" },
    { label: "Deepfake", value: "FAKE" },
    { label: "Authentic", value: "AUTHENTIC" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">History</h1>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive log of all neural analysis operations.</p>
      </div>

      <div className="flex gap-2">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === value
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center gap-3 text-center">
          <Database size={32} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground uppercase tracking-wider">No entries found</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Filename", "Date", "Status", "Confidence", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((scan) => (
                  <ScanRow
                    key={scan.id}
                    scan={scan}
                    onView={() => navigate(`/detection?id=${scan.id}`)}
                    onDelete={() => deleteScan(scan.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.map((scan) => (
              <ScanRow
                key={scan.id}
                scan={scan}
                onView={() => navigate(`/detection?id=${scan.id}`)}
                onDelete={() => deleteScan(scan.id)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Showing {filtered.length} of {scans.length} entries</p>
            <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/75 transition-colors flex items-center gap-2">
              <Trash2 size={14} /> Export Audit Log
            </button>
          </div>
        </>
      )}
    </div>
  );
}
