"use client";
import React, { useState } from "react";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { InputField } from "@/components/Auth/FormFields";
import {
  ResetPasswordFormValues,
  passwordSchema,
} from "@/lib/schema/passwordSchema";
import InvalidToken from "@/components/pages/InvalidToken";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
type Props = {
  orgId?: string;
  customization?: AuthCustomizationSettings;
  isPreview?: boolean;
};
const ResetPassword = ({ orgId, customization, isPreview }: Props) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token && !isPreview) {
    return <InvalidToken />;
  }
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (isPreview) {
      setPending(true);
      await new Promise((res) => setTimeout(res, 1500));
      setPending(false);

      if (data.password === "notcorrect123") {
        toast({
          title: (
            <span
              className="font-semibold"
              style={{
                color: customization?.toastErrorTextColor || undefined,
              }}
            >
              Something went wrong
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
              something went wrong
            </span>
          ),
          ...(customization?.toastErrorBackgroundColor && {
            style: { backgroundColor: customization.toastErrorBackgroundColor },
          }),
        });
      } else {
        // Simulate success
        toast({
          title: (
            <span
              className="font-semibold"
              style={{
                color: customization?.toastTextColor || undefined,
              }}
            >
              Password Changed Successfully
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
              Password Changed successfully
            </span>
          ),
          ...(customization?.toastBackgroundColor && {
            style: { backgroundColor: customization.toastBackgroundColor },
          }),
        });
      }

      return;
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
            <CardTitle
              className="text-2xl font-bold text-center"
              style={{ color: customization?.primaryTextColor || undefined }}
            >
              Reset Password
            </CardTitle>
            <CardDescription
              className="text-center"
              style={{ color: customization?.tertiaryTextColor || undefined }}
            >
              Enter your new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <InputField
                  key={`newPassword-${customization?.inputBorderColor}-${customization?.inputBorderFocusColor}`}
                  control={form.control}
                  name="password"
                  label="New Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  customization={customization}
                />

                <InputField
                  key={`newConfirmPassword-${customization?.inputBorderColor}-${customization?.inputBorderFocusColor}`}
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  customization={customization}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={pending}
                  style={{
                    backgroundColor: pending
                      ? customization?.buttonDisabledBackgroundColor ||
                        undefined
                      : customization?.buttonBackgroundColor || undefined,
                    color: pending
                      ? customization?.buttonDisabledTextColor || undefined
                      : customization?.buttonTextColor || undefined,
                  }}
                >
                  {pending ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin mr-2"
                        style={{
                          color:
                            customization?.buttonDisabledTextColor || undefined,
                        }}
                      />
                      Updating password...
                    </>
                  ) : (
                    <>
                      Reset Password{" "}
                      <ArrowRight
                        className="h-4 w-4 ml-2"
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
            <div
              className="mt-4 text-center text-sm"
              style={{
                color: customization?.secondaryTextColor || undefined,
              }}
            >
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
                style={{
                  color: customization?.linkTextColor || undefined,
                }}
              >
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
