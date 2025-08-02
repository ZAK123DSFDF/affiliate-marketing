import {
  useBackgroundCustomization,
  useButtonCustomization,
  useCardCustomization,
  useCheckboxCustomization,
  useInputCustomization,
  useThemeCustomization,
} from "@/store/useCustomizationStore";

export const useBackgroundColor = () => {
  const backgroundColor = useBackgroundCustomization((s) => s.backgroundColor);
  const setColor = useBackgroundCustomization((s) => s.setColor);

  return { backgroundColor, setColor };
};
export const useCardCustomizationOption = () => {
  const cardShadowColor = useCardCustomization((s) => s.cardShadowColor);
  const cardBorderColor = useCardCustomization((s) => s.cardBorderColor);
  const cardBackgroundColor = useCardCustomization(
    (s) => s.cardBackgroundColor,
  );
  const cardShadow = useCardCustomization((s) => s.cardShadow);
  const cardBorder = useCardCustomization((s) => s.cardBorder);
  const setCardColor = useCardCustomization((s) => s.setColor);
  const setCardSwitch = useCardCustomization((s) => s.setSwitch);

  return {
    cardShadowColor,
    cardBorderColor,
    cardBackgroundColor,
    cardShadow,
    cardBorder,
    setCardColor,
    setCardSwitch,
  };
};
export const useInputCustomizationOption = () => {
  const inputLabelColor = useInputCustomization((s) => s.inputLabelColor);
  const inputLabelErrorColor = useInputCustomization(
    (s) => s.inputLabelErrorColor,
  );
  const inputIconColor = useInputCustomization((s) => s.inputIconColor);
  const inputTextColor = useInputCustomization((s) => s.inputTextColor);
  const inputErrorTextColor = useInputCustomization(
    (s) => s.inputErrorTextColor,
  );
  const inputBorderColor = useInputCustomization((s) => s.inputBorderColor);
  const inputErrorBorderColor = useInputCustomization(
    (s) => s.inputErrorBorderColor,
  );
  const inputPlaceholderTextColor = useInputCustomization(
    (s) => s.inputPlaceholderTextColor,
  );

  const setInputColor = useInputCustomization((s) => s.setColor);

  return {
    inputLabelColor,
    inputLabelErrorColor,
    inputIconColor,
    inputTextColor,
    inputErrorTextColor,
    inputBorderColor,
    inputErrorBorderColor,
    inputPlaceholderTextColor,
    setInputColor,
  };
};
export const useCheckboxCustomizationOption = () => {
  const checkboxLabelColor = useCheckboxCustomization(
    (s) => s.checkboxLabelColor,
  );
  const checkboxActiveColor = useCheckboxCustomization(
    (s) => s.checkboxActiveColor,
  );
  const checkboxInactiveColor = useCheckboxCustomization(
    (s) => s.checkboxInactiveColor,
  );
  const setCheckboxColor = useCheckboxCustomization((s) => s.setColor);

  return {
    checkboxLabelColor,
    checkboxActiveColor,
    checkboxInactiveColor,
    setCheckboxColor,
  };
};
export const useButtonCustomizationOption = () => {
  const buttonTextColor = useButtonCustomization((s) => s.buttonTextColor);
  const buttonBackgroundColor = useButtonCustomization(
    (s) => s.buttonBackgroundColor,
  );
  const buttonDisabledTextColor = useButtonCustomization(
    (s) => s.buttonDisabledTextColor,
  );
  const buttonDisabledBackgroundColor = useButtonCustomization(
    (s) => s.buttonDisabledBackgroundColor,
  );
  const setButtonColor = useButtonCustomization((s) => s.setColor);

  return {
    buttonTextColor,
    buttonBackgroundColor,
    buttonDisabledTextColor,
    buttonDisabledBackgroundColor,
    setButtonColor,
  };
};
export const useThemeCustomizationOption = () => {
  const backgroundColor = useThemeCustomization((s) => s.backgroundColor);
  const linkTextColor = useThemeCustomization((s) => s.linkTextColor);
  const tertiaryTextColor = useThemeCustomization((s) => s.tertiaryTextColor);
  const primaryCustomization = useThemeCustomization(
    (s) => s.primaryCustomization,
  );
  const secondaryCustomization = useThemeCustomization(
    (s) => s.secondaryCustomization,
  );
  const InvalidPrimaryCustomization = useThemeCustomization(
    (s) => s.InvalidPrimaryCustomization,
  );
  const InvalidSecondaryCustomization = useThemeCustomization(
    (s) => s.InvalidSecondaryCustomization,
  );

  const setThemeColor = useThemeCustomization((s) => s.setColor);

  return {
    backgroundColor,
    linkTextColor,
    tertiaryTextColor,
    primaryCustomization,
    secondaryCustomization,
    InvalidPrimaryCustomization,
    InvalidSecondaryCustomization,
    setThemeColor,
  };
};
