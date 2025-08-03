import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import {
  useCardCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useCustomization";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/ThemeCustomizationOptions";
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/CardCustomizationOptions";
import { toValidShadowSize } from "@/util/ValidateShadowColor";
type Props = {
  orgId?: string;
  customization?: AuthCustomizationSettings;
  isPreview?: boolean;
};
const InvalidToken = ({ orgId, customization, isPreview }: Props) => {
  const {
    backgroundColor,
    InvalidPrimaryCustomization,
    InvalidSecondaryCustomization,
  } = useThemeCustomizationOption();
  const {
    cardShadow,
    cardShadowColor,
    cardBorder,
    cardBorderColor,
    cardBackgroundColor,
    cardShadowThickness,
  } = useCardCustomizationOption();
  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 ${
        backgroundColor
          ? ""
          : "bg-gradient-to-b from-background to-background/80"
      }`}
      style={{
        backgroundColor: backgroundColor || undefined,
      }}
    >
      <div className="w-full max-w-md">
        <Card
          className={`relative transition-shadow duration-300 ${
            cardShadow && cardShadowThickness
              ? `shadow-${cardShadowThickness}`
              : cardShadow
                ? "shadow-lg"
                : ""
          } ${cardBorder ? "border" : "border-none"}`}
          style={{
            backgroundColor: cardBackgroundColor || undefined,
            ...(cardShadow && {
              boxShadow: getShadowWithColor(
                toValidShadowSize(cardShadowThickness),
                cardShadowColor,
              ),
            }),
            borderColor:
              cardBorder && cardBorderColor ? cardBorderColor : undefined,
          }}
        >
          <CardHeader className="space-y-1">
            <div className="flex flex-row gap-2 justify-center">
              <CardTitle
                className="text-2xl font-bold text-center text-destructive"
                style={{
                  color: InvalidPrimaryCustomization || undefined,
                }}
              >
                Invalid Token
              </CardTitle>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="InvalidPrimaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-row gap-2 justify-center">
              <p
                className="text-muted-foreground mb-4"
                style={{
                  color: InvalidSecondaryCustomization || undefined,
                }}
              >
                The password reset link is invalid or has expired.
              </p>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="InvalidSecondaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </CardContent>
          {isPreview && (
            <div className="absolute bottom-0 left-0 z-50 p-2">
              <CardCustomizationOptions
                triggerSize="w-6 h-6"
                dropdownSize="w-[150px]"
              />
            </div>
          )}
        </Card>
      </div>
      {isPreview && (
        <div className="absolute bottom-0 left-0 z-50">
          <ThemeCustomizationOptions name="backgroundColor" showLabel={false} />
        </div>
      )}
    </div>
  );
};
export default InvalidToken;
