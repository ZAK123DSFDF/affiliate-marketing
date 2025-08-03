"use client";
import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { GoogleAuthButton } from "@/components/Auth/GoogleAuthButton";
import { InputField } from "@/components/Auth/FormFields";
import { SignUpFormValues, signUpSchema } from "@/lib/schema/signupSchema";
import { useMutation } from "@tanstack/react-query";
import { SignupAffiliateServer } from "@/app/affiliate/[orgId]/signup/action";
import { SignupServer } from "@/app/signup/action";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import {
  useBackgroundColor,
  useButtonCustomizationOption,
  useCardCustomizationOption,
  useInputCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useCustomization";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/CardCustomizationOptions";
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/InputCustomizationOptions";
import { InlineNotesEditor } from "@/components/ui-custom/InlineEditor";
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/ButtonCustomizationOptions";
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/ThemeCustomizationOptions";
type Props = {
  orgId?: string;
  customization?: AuthCustomizationSettings;
  isPreview?: boolean;
};
const Signup = ({ orgId, customization, isPreview }: Props) => {
  const [previewLoading, setPreviewLoading] = useState(false);
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { backgroundColor, linkTextColor, tertiaryTextColor } =
    useThemeCustomizationOption();
  const {
    cardBackgroundColor,
    cardBorderColor,
    cardShadowColor,
    cardBorder,
    cardShadow,
  } = useCardCustomizationOption();
  const {
    buttonDisabledTextColor,
    buttonBackgroundColor,
    buttonDisabledBackgroundColor,
    buttonTextColor,
  } = useButtonCustomizationOption();
  const { toast } = useToast();
  const affiliateMutation = useMutation({
    mutationFn: SignupAffiliateServer,
    onSuccess: (data) => console.log("Affiliate signup success", data),
  });

  const normalMutation = useMutation({
    mutationFn: SignupServer,
    onSuccess: (data) => console.log("Normal signup success", data),
  });
  const isLoading = isPreview
    ? previewLoading
    : orgId
      ? affiliateMutation.isPending
      : normalMutation.isPending;

  const onSubmit = async (data: any) => {
    if (isPreview) {
      setPreviewLoading(true);
      await new Promise((res) => setTimeout(res, 1500));
      setPreviewLoading(false);

      if (data.email === "already@used.com") {
        toast({
          title: (
            <span
              className="font-semibold"
              style={{ color: customization?.toastErrorTextColor || undefined }}
            >
              Signup Failed
            </span>
          ) as unknown as string,
          description: (
            <span
              className="text-sm"
              style={{
                color:
                  customization?.toastErrorSecondaryTextColor ||
                  customization?.toastErrorTextColor ||
                  undefined,
              }}
            >
              This email is already registered.
            </span>
          ),
          ...(!customization?.toastErrorBackgroundColor &&
          !customization?.toastErrorTextColor &&
          !customization?.toastErrorSecondaryTextColor
            ? { variant: "destructive" }
            : {}),
          ...(customization?.toastErrorBackgroundColor && {
            style: { backgroundColor: customization.toastErrorBackgroundColor },
          }),
        });
      } else {
        toast({
          title: (
            <span
              className="font-semibold"
              style={{ color: customization?.toastTextColor || undefined }}
            >
              Signup Successful
            </span>
          ) as unknown as string,
          description: (
            <span
              className="text-sm"
              style={{
                color:
                  customization?.toastSecondaryTextColor ||
                  customization?.toastTextColor ||
                  undefined,
              }}
            >
              Your account has been created!
            </span>
          ),
          ...(customization?.toastBackgroundColor && {
            style: { backgroundColor: customization.toastBackgroundColor },
          }),
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
    } catch (err) {
      console.error("Signup failed:", err);
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
            {isPreview && <InlineNotesEditor name="customNotesSignup" />}
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
                  key={`name-${customization?.inputBorderColor}-${customization?.inputBorderFocusColor}`}
                  control={form.control}
                  name="name"
                  label="Full name"
                  placeholder="john doe"
                  type="text"
                  icon={User}
                  customization={customization}
                />

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

                <InputField
                  key={`confirmPassword-${customization?.inputBorderColor}-${customization?.inputBorderFocusColor}`}
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  customization={customization}
                />

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
                      Sign up{" "}
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
                <span>Already have an account?</span>
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
                  href={`login`}
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
              <CardCustomizationOptions size="w-6 h-6" />
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

export default Signup;
