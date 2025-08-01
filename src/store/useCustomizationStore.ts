import { create } from "zustand";

export const createCustomizationStore = <
  TColors extends Record<string, string>,
  TSwitches extends Record<string, boolean>,
>(
  defaultColors: TColors,
  defaultSwitches: TSwitches,
) =>
  create<
    TColors &
      TSwitches & {
        setColor: (key: keyof TColors, val: string) => void;
        setSwitch: (key: keyof TSwitches, val: boolean) => void;
      }
  >((set) => ({
    ...defaultColors,
    ...defaultSwitches,
    setColor: (key, val) =>
      set((state) => ({
        ...state,
        [key]: val,
      })),
    setSwitch: (key, val) =>
      set((state) => ({
        ...state,
        [key]: val,
      })),
  }));
interface BackgroundCustomizationStore {
  backgroundColor: string;
  setColor: (key: "backgroundColor", val: string) => void;
}

export const useBackgroundCustomization = create<BackgroundCustomizationStore>(
  (set) => ({
    backgroundColor: "",
    setColor: (key, val) => set({ [key]: val }),
  }),
);
