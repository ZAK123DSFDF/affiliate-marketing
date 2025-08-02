"use client";

import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { useThemeCustomizationOption } from "@/hooks/useCustomization";

// These are the valid keys
type ThemeKeys =
  | "backgroundColor"
  | "linkTextColor"
  | "tertiaryTextColor"
  | "primaryCustomization"
  | "secondaryCustomization"
  | "InvalidPrimaryCustomization"
  | "InvalidSecondaryCustomization";

type Props = {
  name: ThemeKeys;
  showLabel?: boolean;
};

export const ThemeCustomizationOptions = ({
  name,
  showLabel = false,
}: Props) => {
  const {
    backgroundColor,
    linkTextColor,
    tertiaryTextColor,
    primaryCustomization,
    secondaryCustomization,
    InvalidPrimaryCustomization,
    InvalidSecondaryCustomization,
    setThemeColor,
  } = useThemeCustomizationOption();

  const valueMap: Record<ThemeKeys, string> = {
    backgroundColor,
    linkTextColor,
    tertiaryTextColor,
    primaryCustomization,
    secondaryCustomization,
    InvalidPrimaryCustomization,
    InvalidSecondaryCustomization,
  };

  const labelMap: Record<ThemeKeys, string> = {
    backgroundColor: "Background",
    linkTextColor: "Link Text",
    tertiaryTextColor: "Tertiary Text",
    primaryCustomization: "Primary",
    secondaryCustomization: "Secondary",
    InvalidPrimaryCustomization: "Invalid Primary",
    InvalidSecondaryCustomization: "Invalid Secondary",
  };

  return (
    <ResettableColorInput
      label={labelMap[name]}
      value={valueMap[name]}
      onChange={(val) => setThemeColor(name, val)}
      showLabel={showLabel}
    />
  );
};
