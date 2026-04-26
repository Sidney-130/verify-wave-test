export type ScanStatus = "FAKE" | "AUTHENTIC" | "SCANNING";

export interface Scan {
  id: string;
  filename: string;
  status: ScanStatus;
  confidence?: number;
  timestamp: string;
  label: string;
  thumbnail?: string;
}

export interface DashboardStats {
  totalScans: number;
  fakeDetected: number;
  accuracy: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface DetectionResult {
  scanId: string;
  filename: string;
  status: ScanStatus;
  confidence: number;
  breakdown: {
    label: string;
    match: number;
  }[];
  metadata: {
    source: string;
    file: string;
    hash: string;
    geo: string;
    encoder: string;
  };
  timestamp: string;
}

export interface HistoryEntry extends Scan {
  date: string;
}
