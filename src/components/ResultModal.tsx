import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { ScanResult } from "../lib/mockApi";

interface ResultModalProps {
  result: ScanResult;
  onClose: () => void;
  onViewResult: () => void;
}

export function ResultModal({ result, onClose, onViewResult }: ResultModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="animate-fade-up w-full max-w-sm bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-1.5 w-full bg-primary" />

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <CheckCircle size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Analysis complete</p>
              <p className="text-xl font-bold text-foreground">Your result is ready</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground truncate">{result.filename}</span>
            <span className="text-xs text-muted-foreground shrink-0">{result.confidence}% confidence</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg text-sm hover:text-foreground hover:bg-muted/40 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Scan Another
            </button>
            <button
              onClick={onViewResult}
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/75 transition-colors flex items-center justify-center gap-2"
            >
              View Result <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
