import { create } from "zustand";

interface MainBackgroundColorStore {
  mainBackgroundColor: string;
  setMainBackgroundColor: (color: string) => void;
}

export const useMainBackgroundColor = create<MainBackgroundColorStore>(
  (set) => ({
    mainBackgroundColor: "",
    setMainBackgroundColor: (color) => set({ mainBackgroundColor: color }),
  }),
);
