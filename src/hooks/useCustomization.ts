import { useBackgroundCustomization } from "@/store/useCustomizationStore";

export const useBackgroundColor = () => {
  const backgroundColor = useBackgroundCustomization((s) => s.backgroundColor);
  const setColor = useBackgroundCustomization((s) => s.setColor);

  return { backgroundColor, setColor };
};
