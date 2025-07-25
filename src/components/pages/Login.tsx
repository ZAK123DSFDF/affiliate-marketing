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
          title: "Login Failed",
          description: "The password you entered is incorrect.",
          ...(!customization?.toastErrorBackgroundColor &&
          !customization?.toastErrorTextColor
            ? { variant: "destructive" }
            : {}),
          ...((customization?.toastErrorBackgroundColor ||
            customization?.toastErrorTextColor) && {
            style: {
              ...(customization?.toastErrorBackgroundColor && {
                backgroundColor: customization.toastErrorBackgroundColor,
              }),
              ...(customization?.toastErrorTextColor && {
                color: customization.toastErrorTextColor,
              }),
            },
          }),
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          ...((customization?.toastBackgroundColor ||
            customization?.toastTextColor) && {
            style: {
              ...(customization?.toastBackgroundColor && {
                backgroundColor: customization.toastBackgroundColor,
              }),
              ...(customization?.toastTextColor && {
                color: customization.toastTextColor,
              }),
            },
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
            {(!customization?.customNotes ||
              customization?.customNotes === "") && (
              <>
                <CardTitle className="text-2xl font-bold text-center">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </>
            )}
            {customization?.customNotes?.trim() && (
              <div
                className="rich-text-preview text-sm"
                dangerouslySetInnerHTML={{ __html: customization.customNotes }}
              />
            )}
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                  <CheckboxField
                    control={form.control}
                    name="rememberMe"
                    label="Remember me"
                    customization={customization}
                  />

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
        </Card>
      </div>
    </div>
  );
};

export default Login;
