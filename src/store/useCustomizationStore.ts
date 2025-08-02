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

export const useBackgroundCustomization = createCustomizationStore(
  { backgroundColor: "" },
  {},
);
export const useCardCustomization = createCustomizationStore(
  {
    cardShadowColor: "",
    cardBorderColor: "",
    cardBackgroundColor: "",
  },
  {
    cardShadow: true,
    cardBorder: true,
  },
);
export const useInputCustomization = createCustomizationStore(
  {
    inputLabelColor: "",
    inputLabelErrorColor: "",
    inputIconColor: "",
    inputTextColor: "",
    inputErrorTextColor: "",
    inputBorderColor: "",
    inputErrorBorderColor: "",
    inputPlaceholderTextColor: "",
  },
  {},
);
