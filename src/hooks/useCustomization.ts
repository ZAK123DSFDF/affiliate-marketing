import {
  useBackgroundCustomization,
  useCardCustomization,
  useInputCustomization,
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
