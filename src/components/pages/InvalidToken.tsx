import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
type Props = {
  orgId?: string;
  customization?: AuthCustomizationSettings;
  isPreview?: boolean;
};
const InvalidToken = ({ orgId, customization, isPreview }: Props) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        customization?.backgroundColor
          ? ""
          : "bg-gradient-to-b from-background to-background/80"
      }`}
      style={{
        backgroundColor: customization?.backgroundColor || undefined,
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
    </div>
  );
};
export default InvalidToken;
