"use client";

import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { useThemeCustomizationOption } from "@/hooks/useAuthCustomization";
import { updateAuthCustomization } from "@/util/AuthCustomizationChanges";

// These are the valid keys
type ThemeKeys =
  | "backgroundColor"
  | "linkTextColor"
  | "tertiaryTextColor"
  | "primaryCustomization"
  | "secondaryCustomization"
  | "InvalidPrimaryCustomization"
  | "InvalidSecondaryCustomization"
  | "emailVerifiedPrimaryColor"
  | "emailVerifiedSecondaryColor"
  | "emailVerifiedIconColor";

type Props = {
  name: ThemeKeys;
  showLabel?: boolean;
  buttonSize?: string;
};

export const ThemeCustomizationOptions = ({
  name,
  showLabel = false,
  buttonSize = "w-8 h-8",
}: Props) => {
  const {
    backgroundColor,
    linkTextColor,
    tertiaryTextColor,
    primaryCustomization,
    secondaryCustomization,
    InvalidPrimaryCustomization,
    InvalidSecondaryCustomization,
    emailVerifiedPrimaryColor,
    emailVerifiedSecondaryColor,
    emailVerifiedIconColor,
  } = useThemeCustomizationOption();

  const valueMap: Record<ThemeKeys, string> = {
    backgroundColor,
    linkTextColor,
    tertiaryTextColor,
    primaryCustomization,
    secondaryCustomization,
    InvalidPrimaryCustomization,
    InvalidSecondaryCustomization,
    emailVerifiedPrimaryColor,
    emailVerifiedSecondaryColor,
    emailVerifiedIconColor,
  };

  const labelMap: Record<ThemeKeys, string> = {
    backgroundColor: "Background",
    linkTextColor: "Link Text",
    tertiaryTextColor: "Tertiary Text",
    primaryCustomization: "Primary",
    secondaryCustomization: "Secondary",
    InvalidPrimaryCustomization: "Invalid Primary",
    InvalidSecondaryCustomization: "Invalid Secondary",
    emailVerifiedPrimaryColor: "Email Verified Primary",
    emailVerifiedSecondaryColor: "Email Verified Secondary",
    emailVerifiedIconColor: "Email Verified Icon",
  };

  return (
    <ResettableColorInput
      label={labelMap[name]}
      value={valueMap[name]}
      onChange={(val) =>
        updateAuthCustomization("useThemeCustomization", name, val)
      }
      showLabel={showLabel}
      buttonSize={buttonSize}
    />
  );
};
