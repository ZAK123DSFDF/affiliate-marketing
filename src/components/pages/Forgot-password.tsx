"use client";
import React, { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { InputField } from "@/components/Auth/FormFields";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/schema/forgotPasswordSchema";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import {
  useBackgroundColor,
  useCardCustomizationOption,
  useInputCustomizationOption,
} from "@/hooks/useCustomization";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/CardCustomizationOptions";
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/InputCustomizationOptions";
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
  const { toast } = useToast();
  const { backgroundColor, setColor } = useBackgroundColor();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (isPreview) {
      setPending(true);
      await new Promise((res) => setTimeout(res, 1500));
      setPending(false);

      if (data.email === "notfound@gmail.com") {
        toast({
          title: (
            <span
              className="font-semibold"
              style={{
                color: customization?.toastErrorTextColor || undefined,
              }}
            >
              Email Not Found
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
              We couldn’t find an account with that email address.
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
              Email Sent
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
              If the email exists, a reset link has been sent.
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
            <CardTitle
              className="text-2xl font-bold text-center"
              style={{ color: customization?.primaryTextColor || undefined }}
            >
              Forgot Password
            </CardTitle>
            <CardDescription
              className="text-center"
              style={{ color: customization?.tertiaryTextColor || undefined }}
            >
              Enter your email to receive a password reset link
            </CardDescription>
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
                      Sending email...
                    </>
                  ) : (
                    <>
                      Send Reset Link{" "}
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
              className="text-center text-sm"
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
          {isPreview && (
            <div className="absolute bottom-0 left-0 z-50 p-2">
              <CardCustomizationOptions />
            </div>
          )}
        </Card>
      </div>
      {isPreview && (
        <div className="absolute bottom-0 left-0 z-50">
          <ResettableColorInput
            label="Background"
            value={backgroundColor}
            onChange={(val) => setColor("backgroundColor", val)}
            showLabel={false}
          />
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
