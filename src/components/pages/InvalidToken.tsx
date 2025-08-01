import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import { useBackgroundColor } from "@/hooks/useCustomization";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
type Props = {
  orgId?: string;
  customization?: AuthCustomizationSettings;
  isPreview?: boolean;
};
const InvalidToken = ({ orgId, customization, isPreview }: Props) => {
  const { backgroundColor, setColor } = useBackgroundColor();
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
          className={`transition-shadow duration-300 ${
            customization?.showShadow && customization?.shadowThickness
              ? `shadow-${customization.shadowThickness}`
              : customization?.showShadow
                ? "shadow-lg"
                : ""
          } ${customization?.showBorder ? "border" : "border-none"}`}
          style={{
            backgroundColor: customization?.cardBackgroundColor || undefined,
            ...(customization?.showShadow && {
              boxShadow: getShadowWithColor(
                customization.shadowThickness || "lg",
                customization.shadowColor,
              ),
            }),
            borderColor:
              customization?.showBorder && customization?.borderColor
                ? customization.borderColor
                : undefined,
          }}
        >
          <CardHeader className="space-y-1">
            <CardTitle
              className="text-2xl font-bold text-center text-destructive"
              style={{
                color: customization?.errorPagePrimaryTextColor || undefined,
              }}
            >
              Invalid Token
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p
              className="text-muted-foreground mb-4"
              style={{
                color: customization?.errorPageSecondaryTextColor || undefined,
              }}
            >
              The password reset link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
      {isPreview && (
        <div className="absolute bottom-0 left-0 z-50">
          <ResettableColorInput
            label="Background"
            value={backgroundColor}
            onChange={(val) => setColor("backgroundColor", val)}
          />
        </div>
      )}
    </div>
  );
};
export default InvalidToken;
