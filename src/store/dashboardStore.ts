import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DashboardStats, Scan, ScanStatus } from "../types";

interface DashboardStore {
  stats: DashboardStats;
  recentScans: Scan[];
  addScan: (filename: string) => string;
  resolveScan: (id: string, status: ScanStatus, confidence: number) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      stats: {
        totalScans: 0,
        fakeDetected: 0,
        accuracy: 99,
      },
      recentScans: [],
      addScan: (filename) => {
        const id = crypto.randomUUID();
        const newScan: Scan = {
          id,
          filename,
          status: "SCANNING",
          timestamp: "just now",
          label: "Scanning...",
        };
        set((s) => ({ recentScans: [newScan, ...s.recentScans].slice(0, 10) }));
        return id;
      },
      resolveScan: (id, status, confidence) =>
        set((s) => ({
          recentScans: s.recentScans.map((scan) =>
            scan.id === id
              ? { ...scan, status, confidence, label: status === "FAKE" ? "Deepfake Detected" : "Authentic", timestamp: "just now" }
              : scan
          ),
          stats: {
            ...s.stats,
            totalScans: s.stats.totalScans + 1,
            fakeDetected: status === "FAKE" ? s.stats.fakeDetected + 1 : s.stats.fakeDetected,
          },
        })),
    }),
    { name: "trustscan-dashboard" }
  )
);
