import { create } from "zustand";

interface UIStore {
  notificationCount: number;
  setNotificationCount: (count: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  notificationCount: 3,
  setNotificationCount: (count) => set({ notificationCount: count }),
}));
