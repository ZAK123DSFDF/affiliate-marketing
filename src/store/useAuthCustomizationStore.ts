import { createCustomizationStore } from "@/store/CreateCustomizationStore";

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
