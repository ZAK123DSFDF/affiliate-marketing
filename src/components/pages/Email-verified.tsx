import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import {
  useButtonCustomizationOption,
  useCardCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useAuthCustomization";
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions";
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions";
import { toValidShadowSize } from "@/util/ValidateShadowColor";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions";

type Props = {
  orgId?: string;
  isPreview?: boolean;
};

const EmailVerified = ({ orgId, isPreview }: Props) => {
  const { backgroundColor } = useThemeCustomizationOption();
  const {
    emailVerifiedPrimaryColor,
    emailVerifiedSecondaryColor,
    emailVerifiedIconColor,
  } = useThemeCustomizationOption();
  const {
    cardShadow,
    cardShadowColor,
    cardBorder,
    cardBorderColor,
    cardBackgroundColor,
    cardShadowThickness,
  } = useCardCustomizationOption();
  const { buttonBackgroundColor, buttonTextColor } =
    useButtonCustomizationOption();

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
      <div className="relative w-full max-w-md">
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
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex flex-row gap-2 justify-center">
              <CheckCircle2
                className="w-16 h-16 text-green-500"
                style={{
                  color: emailVerifiedIconColor || undefined,
                }}
              />
              {isPreview && (
                <ThemeCustomizationOptions
                  name="emailVerifiedIconColor"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
            <div className="flex flex-row gap-2 justify-center">
              <CardTitle
                className="text-2xl font-bold text-center text-green-600"
                style={{
                  color: emailVerifiedPrimaryColor || undefined,
                }}
              >
                Email Verified!
              </CardTitle>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="emailVerifiedPrimaryColor"
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
                  color: emailVerifiedSecondaryColor || undefined,
                }}
              >
                Your email address has been successfully verified. You can now
                access all features.
              </p>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="emailVerifiedSecondaryColor"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>

            <Link href="/dashboard" className="w-full block">
              <Button
                className="w-full mb-6"
                size="lg"
                style={{
                  backgroundColor: buttonBackgroundColor || undefined,
                  color: buttonTextColor || undefined,
                }}
              >
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        {isPreview && (
          <div className="absolute bottom-0 right-0 p-2">
            <ButtonCustomizationOptions onlyShowEnabled size="w-6 h-6" />
          </div>
        )}

        {isPreview && (
          <div className="absolute bottom-0 left-0 p-2">
            <CardCustomizationOptions
              triggerSize="w-6 h-6"
              dropdownSize="w-[150px]"
            />
          </div>
        )}
      </div>

      {isPreview && (
        <div className="absolute bottom-0 left-0 z-50">
          <ThemeCustomizationOptions name="backgroundColor" showLabel={false} />
        </div>
      )}
    </div>
  );
};

export default EmailVerified;
