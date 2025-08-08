import { create } from "zustand";

export const createCustomizationStore = <
  TColors extends Record<string, string>,
  TSwitches extends Record<string, boolean>,
  TNotes extends Record<string, string>,
>(
  defaultColors: TColors,
  defaultSwitches: TSwitches,
  defaultNotes: TNotes,
) =>
  create<
    TColors &
      TSwitches &
      TNotes & {
        setColor: (key: keyof TColors, val: string) => void;
        setSwitch: (key: keyof TSwitches, val: boolean) => void;
        setNote: (key: keyof TNotes, val: string) => void;
      }
  >((set) => ({
    ...defaultColors,
    ...defaultSwitches,
    ...defaultNotes,
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
    setNote: (key, val) =>
      set((state) => ({
        ...state,
        [key]: val,
      })),
  }));
