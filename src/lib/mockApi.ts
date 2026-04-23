import type { ScanStatus } from "../types";

export interface ScanResult {
  id: string;
  filename: string;
  status: ScanStatus;
  confidence: number;
  breakdown: { label: string; match: number }[];
  timestamp: string;
}

function hashFile(name: string, size: number): number {
  let h = size;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function scanFile(file: File): Promise<ScanResult> {
  await delay(2000 + (file.size % 1500));

  const hash = hashFile(file.name, file.size);
  const isFake = hash % 3 !== 0;
  const status: ScanStatus = isFake ? "FAKE" : "AUTHENTIC";
  const confidence = parseFloat((70 + (hash % 29) + ((hash >> 4) % 10) * 0.1).toFixed(1));

  const isImage = file.type.startsWith("image/");

  const fakeImageBreakdowns = [
    [
      { label: "GAN-Generated Texture", match: parseFloat((80 + (hash % 19)).toFixed(1)) },
      { label: "Pixel Inconsistency", match: parseFloat((60 + (hash % 30)).toFixed(1)) },
    ],
    [
      { label: "Face Region Manipulation", match: parseFloat((75 + (hash % 22)).toFixed(1)) },
      { label: "Compression Anomaly", match: parseFloat((55 + (hash % 35)).toFixed(1)) },
    ],
  ];

  const fakeVideoBreakdowns = [
    [
      { label: "Deepfake Face Swap", match: parseFloat((80 + (hash % 19)).toFixed(1)) },
      { label: "Synthetic Voice Overlay", match: parseFloat((60 + (hash % 30)).toFixed(1)) },
    ],
    [
      { label: "GAN Artifact Detection", match: parseFloat((75 + (hash % 22)).toFixed(1)) },
      { label: "Temporal Inconsistency", match: parseFloat((55 + (hash % 35)).toFixed(1)) },
    ],
    [
      { label: "Lip Sync Mismatch", match: parseFloat((65 + (hash % 28)).toFixed(1)) },
      { label: "Eye Blink Anomaly", match: parseFloat((50 + (hash % 40)).toFixed(1)) },
    ],
  ];

  const fakePool = isImage ? fakeImageBreakdowns : fakeVideoBreakdowns;
  const breakdown = isFake ? fakePool[hash % fakePool.length] : [];

  return {
    id: crypto.randomUUID(),
    filename: file.name,
    status,
    confidence,
    breakdown,
    timestamp: new Date().toISOString(),
  };
}
