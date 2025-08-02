"use client";
import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { InputField, CheckboxField } from "@/components/Auth/FormFields";
import { LoginFormValues, loginSchema } from "@/lib/schema/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { LoginAffiliateServer } from "@/app/affiliate/[orgId]/login/action";
import { LoginServer } from "@/app/login/action";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import {
  useBackgroundColor,
  useButtonCustomizationOption,
  useCardCustomizationOption,
  useCheckboxCustomizationOption,
  useInputCustomizationOption,
} from "@/hooks/useCustomization";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/CardCustomizationOptions";
import { CheckboxCustomizationOptions } from "@/components/ui-custom/Customization/CheckboxCustomizationOptions";
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/InputCustomizationOptions";
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/ButtonCustomizationOptions";
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/ThemeCustomizationOptions";
type Props = {
  orgId?: string;
  customization?: AuthCustomizationSettings;
  isPreview?: boolean;
};
const Login = ({ orgId, customization, isPreview = false }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [previewLoading, setPreviewLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { backgroundColor, setColor } = useBackgroundColor();
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
        toast({
          title: (
            <span
              className="font-semibold"
              style={{
                color: customization?.toastErrorTextColor || undefined,
              }}
            >
              Login Failed
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
              The password you entered is incorrect.
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
              style={{
                color: customization?.toastTextColor || undefined,
              }}
            >
              Login Successful
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
              Welcome back!
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
            {(!customization?.customNotesLogin ||
              customization?.customNotesLogin === "") && (
              <>
                <CardTitle className="text-2xl font-bold text-center">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </>
            )}
            {customization?.customNotesLogin?.trim() && (
              <div
                className="rich-text-preview text-sm"
                dangerouslySetInnerHTML={{
                  __html: customization.customNotesLogin,
                }}
              />
            )}
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative space-y-4"
              >
                {isPreview && (
                  <div className="absolute top-[-10] right-0 z-50">
                    <InputCustomizationOptions />
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
                    {isPreview && <CheckboxCustomizationOptions />}
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                    style={{
                      color: customization?.linkTextColor || undefined,
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  style={{
                    backgroundColor: isLoading
                      ? customization?.buttonDisabledBackgroundColor ||
                        undefined
                      : customization?.buttonBackgroundColor || undefined,
                    color: isLoading
                      ? customization?.buttonDisabledTextColor || undefined
                      : customization?.buttonTextColor || undefined,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        style={{
                          color:
                            customization?.buttonDisabledTextColor || undefined,
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
                          color: customization?.buttonTextColor || undefined,
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
            <div
              className="text-center text-sm"
              style={{
                color: customization?.secondaryTextColor || undefined,
              }}
            >
              Don't have an account?{" "}
              <Link
                href={`signup`}
                className="font-medium text-primary underline-offset-4 hover:underline"
                style={{
                  color: customization?.linkTextColor || undefined,
                }}
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
          {isPreview && (
            <div className="absolute bottom-0 left-0 z-50 p-2">
              <CardCustomizationOptions />
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
