import { useMemo, useEffect } from "react";
import { IMAGE_TYPES } from "../lib/fileUtils";

interface FilePreviewProps {
  file: File;
  scanning: boolean;
}

export function FilePreview({ file, scanning }: FilePreviewProps) {
  const isImage = IMAGE_TYPES.includes(file.type);
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  return (
    <div className="relative w-full h-52 rounded-lg overflow-hidden bg-black">
      {isImage ? (
        <img
          src={url}
          alt={file.name}
          className={`w-full h-full object-cover transition-all duration-500 ${scanning ? "scale-105 blur-sm brightness-50" : ""}`}
        />
      ) : (
        <video
          src={url}
          controls={!scanning}
          className={`w-full h-full object-cover transition-all duration-500 ${scanning ? "scale-105 blur-sm brightness-50" : ""}`}
        />
      )}

      {scanning && (
        <>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute animate-scan-line left-0 right-0 h-0.5 bg-primary shadow-[0_0_12px_4px] shadow-primary/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-white tracking-wider">
              Analyzing...
            </p>
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
