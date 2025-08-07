"use client";
import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { InputField, CheckboxField } from "@/components/Auth/FormFields";
import { LoginFormValues, loginSchema } from "@/lib/schema/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { LoginAffiliateServer } from "@/app/affiliate/[orgId]/login/action";
import { LoginServer } from "@/app/login/action";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import {
  useButtonCustomizationOption,
  useCardCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useAuthCustomization";
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions";
import { CheckboxCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CheckboxCustomizationOptions";
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions";
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions";
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions";
import { InlineNotesEditor } from "@/components/ui-custom/InlineEditor";
import { toValidShadowSize } from "@/util/ValidateShadowColor";
import { useToastCustomizationOption } from "@/hooks/useDashboardCustomization";
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast";
type Props = {
  orgId?: string;
  customization?: AuthCustomizationSettings;
  isPreview?: boolean;
};
const Login = ({ orgId, customization, isPreview = false }: Props) => {
  const { showCustomToast } = useCustomToast();
  const [previewLoading, setPreviewLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { backgroundColor, linkTextColor, tertiaryTextColor } =
    useThemeCustomizationOption();
  const {
    cardShadow,
    cardShadowColor,
    cardBorder,
    cardBorderColor,
    cardBackgroundColor,
    cardShadowThickness,
  } = useCardCustomizationOption();
  const {
    buttonDisabledTextColor,
    buttonBackgroundColor,
    buttonDisabledBackgroundColor,
    buttonTextColor,
  } = useButtonCustomizationOption();
  const affiliateMutation = useMutation({
    mutationFn: LoginAffiliateServer,
    onSuccess: (data: any) => {
      console.log("Affiliate login success", data);
    },
  });

  const normalMutation = useMutation({
    mutationFn: LoginServer,
    onSuccess: (data: any) => {
      console.log("Normal login success", data);
    },
  });
  const isLoading = isPreview
    ? previewLoading
    : orgId
      ? affiliateMutation.isPending
      : normalMutation.isPending;
  const onSubmit = async (data: any) => {
    if (isPreview) {
      setPreviewLoading(true);

      // Simulate loading delay
      await new Promise((res) => setTimeout(res, 1500));

      setPreviewLoading(false);

      // Simulate error if password is "incorrect123"
      if (data.password === "incorrect123") {
        showCustomToast({
          type: "error",
          title: "Login Failed",
          description: "The password you entered is incorrect.",
        });
      } else {
        showCustomToast({
          type: "success",
          title: "Login Successful",
          description: "Welcome back!",
        });
      }

      return;
    }
    try {
      if (orgId) {
        affiliateMutation.mutate({ ...data, organizationId: orgId });
      } else {
        normalMutation.mutate(data);
      }
    } catch (error) {
      console.error("Login failed", error);
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
            {isPreview && <InlineNotesEditor name="customNotesLogin" />}
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

                <InputField
                  key={`password-${customization?.inputBorderColor}-${customization?.inputBorderFocusColor}`}
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  customization={customization}
                />

                <div className="flex items-center justify-between">
                  <div className="flex flex-row gap-2">
                    <CheckboxField
                      control={form.control}
                      name="rememberMe"
                      label="Remember me"
                      customization={customization}
                    />
                    {isPreview && (
                      <CheckboxCustomizationOptions size="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex flex-row gap-2">
                    {isPreview && (
                      <ThemeCustomizationOptions
                        name="linkTextColor"
                        showLabel={false}
                        buttonSize="w-4 h-4"
                      />
                    )}
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                      style={{
                        color: linkTextColor || undefined,
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  style={{
                    backgroundColor: isLoading
                      ? buttonDisabledBackgroundColor || undefined
                      : buttonBackgroundColor || undefined,
                    color: isLoading
                      ? buttonDisabledTextColor || undefined
                      : buttonTextColor || undefined,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        style={{
                          color: buttonDisabledTextColor || undefined,
                        }}
                      />
                      Please wait...
                    </>
                  ) : (
                    <>
                      Log in{" "}
                      <ArrowRight
                        className="h-4 w-4"
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
                <span>Don't have an account? </span>
              </div>

              <Link
                href={`signup`}
                className="font-medium text-primary underline-offset-4 hover:underline"
                style={{
                  color: linkTextColor || undefined,
                }}
              >
                Sign up
              </Link>
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

export default Login;
