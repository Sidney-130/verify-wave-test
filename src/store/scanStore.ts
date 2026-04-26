import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScanStatus } from "../types";

export interface HistoryScan {
  id: string;
  filename: string;
  status: ScanStatus;
  confidence: number;
  date: string;
  breakdown: { label: string; match: number }[];
  thumbnail?: string;
}

interface ScanStore {
  scans: HistoryScan[];
  addScan: (scan: HistoryScan) => void;
  deleteScan: (id: string) => void;
  getScan: (id: string) => HistoryScan | undefined;
}

export const useScanStore = create<ScanStore>()(
  persist(
    (set, get) => ({
      scans: [],
      addScan: (scan) => set((s) => ({ scans: [scan, ...s.scans] })),
      deleteScan: (id) => set((s) => ({ scans: s.scans.filter((sc) => sc.id !== id) })),
      getScan: (id) => get().scans.find((s) => s.id === id),
    }),
    { name: "trustscan-history" }
  )
);
