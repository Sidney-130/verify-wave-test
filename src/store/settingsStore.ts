import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStore {
  operatorName: string;
  email: string;
  twoFactor: boolean;
  language: string;
  notificationPriority: "ALL_ALERTS" | "CRITICAL_ONLY";
  setField: <K extends keyof Omit<SettingsStore, "setField" | "save">>(
    key: K,
    value: SettingsStore[K],
  ) => void;
  save: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      operatorName: "Janey",
      email: "janey@gmail.com",
      twoFactor: true,
      language: "English (US)",
      notificationPriority: "ALL_ALERTS",
      setField: (key, value) => set({ [key]: value } as Partial<SettingsStore>),
      save: () => {},
    }),
    { name: "trustscan-settings" },
  ),
);
