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

export const useCardCustomization = createCustomizationStore(
  {
    cardShadowColor: "",
    cardBorderColor: "",
    cardBackgroundColor: "",
    cardShadowThickness: "md",
  },
  {
    cardShadow: true,
    cardBorder: true,
  },
  {},
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
    inputBorderFocusColor: "",
  },
  {},
  {},
);
export const useCheckboxCustomization = createCustomizationStore(
  {
    checkboxLabelColor: "",
    checkboxActiveColor: "",
    checkboxInactiveColor: "",
  },
  {},
  {},
);
export const useButtonCustomization = createCustomizationStore(
  {
    buttonTextColor: "",
    buttonBackgroundColor: "",
    buttonDisabledTextColor: "",
    buttonDisabledBackgroundColor: "",
  },
  {},
  {},
);

export const useThemeCustomization = createCustomizationStore(
  {
    backgroundColor: "",
    linkTextColor: "",
    tertiaryTextColor: "",
    primaryCustomization: "",
    secondaryCustomization: "",
    InvalidPrimaryCustomization: "",
    InvalidSecondaryCustomization: "",
    emailVerifiedPrimaryColor: "",
    emailVerifiedSecondaryColor: "",
    emailVerifiedIconColor: "",
  },
  {},
  {},
);
export const useNotesCustomization = createCustomizationStore(
  {},
  {},
  {
    customNotesLogin: "",
    customNotesSignup: "",
  },
);
