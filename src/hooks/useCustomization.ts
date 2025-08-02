import {
  useBackgroundCustomization,
  useCardCustomization,
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
