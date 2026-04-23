import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  name: string;
  email: string;
  role: string;
  setField: <K extends keyof Omit<UserStore, "setField">>(
    key: K,
    value: UserStore[K],
  ) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: "Janey",
      email: "janey@gmail.com",
      role: "PREMIUM OPS",
      setField: (key, value) => set({ [key]: value } as Partial<UserStore>),
    }),
    { name: "trustscan-user" },
  ),
);
