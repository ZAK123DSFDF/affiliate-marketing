"use client";
import React, { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { InputField } from "@/components/Auth/FormFields";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/schema/forgotPasswordSchema";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import {
  useButtonCustomizationOption,
  useCardCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useAuthCustomization";
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions";
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions";
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions";
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions";
import { toValidShadowSize } from "@/util/ValidateShadowColor";
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast";
type Props = {
  orgId?: string;
  customization?: AuthCustomizationSettings;
  isPreview?: boolean;
};
const ForgotPassword = ({ orgId, customization, isPreview }: Props) => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const [pending, setPending] = useState(false);
  const { showCustomToast } = useCustomToast();
  const { backgroundColor, linkTextColor, tertiaryTextColor } =
    useThemeCustomizationOption();
  const {
    buttonDisabledTextColor,
    buttonBackgroundColor,
    buttonDisabledBackgroundColor,
    buttonTextColor,
  } = useButtonCustomizationOption();
  const { primaryCustomization, secondaryCustomization } =
    useThemeCustomizationOption();
  const {
    cardShadow,
    cardShadowColor,
    cardBorder,
    cardBorderColor,
    cardBackgroundColor,
    cardShadowThickness,
  } = useCardCustomizationOption();
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (isPreview) {
      setPending(true);
      await new Promise((res) => setTimeout(res, 1500));
      setPending(false);

      if (data.email === "notfound@gmail.com") {
        showCustomToast({
          type: "error",
          title: "Email Not Found",
          description: "We couldn't find an account with this email.",
        });
      } else {
        // Simulate success
        showCustomToast({
          type: "success",
          title: "Email Sent",
          description: "If the email exists, a reset link has been sent.",
        });
      }

      return;
    }
  };

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
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">
                A
              </div>
              <h1 className="text-2xl font-bold">AffiliateX</h1>
            </div>
          </Link>
        </div>

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
                className="text-2xl font-bold text-center"
                style={{ color: primaryCustomization || undefined }}
              >
                Forgot Password
              </CardTitle>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="primaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
            <div className="flex flex-row gap-2 justify-center">
              <CardDescription
                className="text-center"
                style={{ color: secondaryCustomization || undefined }}
              >
                Enter your email to receive a password reset link
              </CardDescription>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="secondaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative space-y-4"
              >
                {isPreview && (
                  <div className="absolute top-[-10] right-0 z-50">
                    <InputCustomizationOptions size="w-6 h-6" />
                  </div>
                )}
                <InputField
                  key={`email-${customization?.inputBorderColor}-${customization?.inputBorderFocusColor}`}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                  type="email"
                  icon={Mail}
                  customization={customization}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={pending}
                  style={{
                    backgroundColor: pending
                      ? buttonDisabledBackgroundColor || undefined
                      : buttonBackgroundColor || undefined,
                    color: pending
                      ? buttonDisabledTextColor || undefined
                      : buttonTextColor || undefined,
                  }}
                >
                  {pending ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin mr-2"
                        style={{
                          color: buttonDisabledTextColor || undefined,
                        }}
                      />
                      Sending email...
                    </>
                  ) : (
                    <>
                      Send Reset Link{" "}
                      <ArrowRight
                        className="h-4 w-4 ml-2"
                        style={{
                          color: buttonTextColor || undefined,
                        }}
                      />
                    </>
                  )}
                </Button>
                {isPreview && <ButtonCustomizationOptions size="w-6 h-6" />}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div
              className="text-center text-sm"
              style={{
                color: tertiaryTextColor || undefined,
              }}
            >
              <div className="flex flex-row gap-2">
                {isPreview && (
                  <ThemeCustomizationOptions
                    name="tertiaryTextColor"
                    showLabel={false}
                    buttonSize="w-4 h-4"
                  />
                )}
                <span>Remember your password?</span>
              </div>
              <div className="flex flex-row gap-2 justify-center">
                {isPreview && (
                  <ThemeCustomizationOptions
                    name="linkTextColor"
                    showLabel={false}
                    buttonSize="w-4 h-4"
                  />
                )}
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  style={{
                    color: linkTextColor || undefined,
                  }}
                >
                  Log in
                </Link>
              </div>
            </div>
          </CardFooter>
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

export default ForgotPassword;
