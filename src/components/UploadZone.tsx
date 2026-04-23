import { useRef, useState, useEffect } from "react";
import { Upload, X, CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { scanFile, type ScanResult } from "../lib/mockApi";
import { useDashboardStore } from "../store/dashboardStore";
import { useScanStore } from "../store/scanStore";

const IMAGE_TYPES = ["image/jpeg", "image/png"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const ACCEPTED = [...IMAGE_TYPES, ...VIDEO_TYPES];

function validate(f: File): string | null {
  if (!ACCEPTED.includes(f.type)) return "Unsupported format. Use MP4, MOV, JPG or PNG.";
  if (IMAGE_TYPES.includes(f.type) && f.size > 5 * 1024 * 1024) return "Images must be under 5MB.";
  if (VIDEO_TYPES.includes(f.type) && f.size > 20 * 1024 * 1024) return "Videos must be under 20MB.";
  return null;
}

function FilePreview({ file, scanning }: { file: File; scanning: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  const isImage = IMAGE_TYPES.includes(file.type);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) return null;

  return (
    <div className="relative w-full h-52 rounded-lg overflow-hidden bg-black">
      {isImage ? (
        <img src={url} alt={file.name} className={`w-full h-full object-cover transition-all duration-500 ${scanning ? "scale-105 blur-sm brightness-50" : ""}`} />
      ) : (
        <video src={url} controls={!scanning} className={`w-full h-full object-cover transition-all duration-500 ${scanning ? "scale-105 blur-sm brightness-50" : ""}`} />
      )}

      {scanning && (
        <>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute animate-scan-line left-0 right-0 h-0.5 bg-primary shadow-[0_0_12px_4px] shadow-primary/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-white tracking-wider">Analyzing...</p>
            <p className="text-xs text-white/60">Running detection models</p>
          </div>
        </>
      )}

      {!scanning && (
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-0.5 text-xs text-white truncate max-w-[80%]">
          {file.name}
        </div>
      )}
    </div>
  );
}

function ResultModal({ result, onClose, onViewResult }: { result: ScanResult; onClose: () => void; onViewResult: () => void }) {
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

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [_validationError, setValidationError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const navigate = useNavigate();
  const { addScan, resolveScan } = useDashboardStore();
  const addToHistory = useScanStore((s) => s.addScan);

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: scanFile,
    onMutate: (f) => addScan(f.name),
    onSuccess: (res, _vars, dashboardId) => {
      const id = dashboardId as string;
      resolveScan(id, res.status, res.confidence);
      addToHistory({
        id,
        filename: res.filename,
        status: res.status,
        confidence: res.confidence,
        date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        breakdown: res.breakdown,
      });
      setResult({ ...res, id });
    },
  });

  function handleFile(f: File) {
    const err = validate(f);
    if (err) { setValidationError(err); setFile(null); return; }
    setValidationError(null);
    reset();
    setResult(null);
    setFile(f);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  function clearFile() {
    setFile(null);
    setValidationError(null);
    setResult(null);
    reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleScan() {
    if (!file) return;
    const fileToScan = file;
    mutate(fileToScan);
  }

  return (
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`bg-card border-2 rounded-lg overflow-hidden transition-all duration-300 ${
          dragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp4,.mov,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleChange}
        />

        {file ? (
          <div>
            <div className="relative">
              <FilePreview file={file} scanning={isPending} />
              {!isPending && (
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="p-4 space-y-3">
              {isError && <p className="text-xs text-red-400">Scan failed. Please try again.</p>}
              {!isPending && (
                <button
                  onClick={handleScan}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/75 transition-colors"
                >
                  Start Scan
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div className={`w-14 h-14 rounded-full bg-muted flex items-center justify-center transition-all duration-300 ${isPending ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}>
              <Upload size={24} className={`text-primary transition-all ${isPending ? "animate-pulse" : ""}`} />
            </div>

            <div>
              <p className="text-lg font-semibold text-foreground mb-1">
                {isPending ? "Analyzing file..." : "Initialize Scan"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isPending
                  ? "Running deepfake detection models..."
                  : "Drop your media files here or tap to explore your local storage."}
              </p>
            </div>

            {isError && <p className="text-xs text-red-400">Scan failed. Please try again.</p>}

            <button
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/75 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="text-lg">+</span> {isPending ? "Scanning..." : "Upload File"}
            </button>

            <div className="w-full text-xs text-muted-foreground uppercase tracking-wider text-center">
              MP4, MOV (max 20MB) &nbsp;|&nbsp; JPG, PNG (max 5MB)
            </div>
          </div>
        )}
      </div>

      {result && (
        <ResultModal
          result={result}
          onClose={clearFile}
          onViewResult={() => { const id = result.id; setResult(null); navigate(`/results?id=${id}`); }}
        />
      )}
    </>
  );
}
