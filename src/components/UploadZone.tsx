import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { scanFile, type ScanResult } from "../lib/mockApi";
import { validate, generateThumbnail } from "../lib/fileUtils";
import { useDashboardStore } from "../store/dashboardStore";
import { useScanStore } from "../store/scanStore";
import { FilePreview } from "./FilePreview";
import { ResultModal } from "./ResultModal";

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const navigate = useNavigate();
  const { addScan, resolveScan } = useDashboardStore();
  const addToHistory = useScanStore((s) => s.addScan);

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: scanFile,
    onMutate: (f) => addScan(f.name, thumbnailRef.current),
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
        thumbnail: thumbnailRef.current,
      });
      setResult({ ...res, id });
    },
  });

  async function handleFile(f: File) {
    const err = validate(f);
    if (err) { setValidationError(err); setFile(null); return; }
    setValidationError(null);
    reset();
    setResult(null);
    setFile(f);
    thumbnailRef.current = await generateThumbnail(f);
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
    thumbnailRef.current = "";
    setValidationError(null);
    setResult(null);
    reset();
    if (inputRef.current) inputRef.current.value = "";
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
                  onClick={() => mutate(file)}
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

            {validationError && <p className="text-xs text-red-400">{validationError}</p>}
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
