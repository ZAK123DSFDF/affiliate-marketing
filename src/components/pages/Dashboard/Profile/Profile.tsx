"use client"

import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

import {
  updateAffiliatePassword,
  updateAffiliateProfile,
  validateCurrentPassword,
} from "@/app/affiliate/[orgId]/dashboard/profile/action"
import { Loader2, Mail, Lock, User } from "lucide-react"
import {
  updateUserPassword,
  updateUserProfile,
  validateCurrentSellerPassword,
} from "@/app/seller/[orgId]/dashboard/profile/action"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema } from "@/lib/schema/profileSchema"
import {
  currentPasswordSchema,
  newPasswordSchema,
} from "@/lib/schema/passwordSchema"
import { InputField } from "@/components/Auth/FormFields"
import { getShadowWithColor } from "@/util/GetShadowWithColor"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import { DashboardButtonCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardButtonCustomizationOptions"
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions"
import { Separator } from "@/components/ui/separator"
import { DialogCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DialogCustomizationOptions"
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions"
import {
  useDashboardButtonCustomizationOption,
  useDashboardCardCustomizationOption,
  useDashboardThemeCustomizationOption,
} from "@/hooks/useDashboardCustomization"
import { toValidShadowSize } from "@/util/ValidateShadowColor"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"

interface CommonData {
  id: string
  name: string
  email: string
  image?: string | null
  paypalEmail: string
}

interface ProfileProps {
  AffiliateData?: CommonData
  UserData?: CommonData
  isPreview?: boolean
  affiliate: boolean
  orgId: string
}

export default function Profile({
  AffiliateData,
  UserData,
  isPreview = false,
  affiliate = false,
  orgId,
}: ProfileProps) {
  const initialName = AffiliateData
    ? AffiliateData.name
    : (UserData?.name ?? "")
  const initialEmail = AffiliateData
    ? AffiliateData.email
    : (UserData?.email ?? "")
  const initialPaypalEmail = AffiliateData?.paypalEmail ?? ""
  console.log("AffiliateData", AffiliateData)
  const dashboardTheme = useDashboardThemeCustomizationOption()
  const dashboardCard = useDashboardCardCustomizationOption()
  const dashboardButton = useDashboardButtonCustomizationOption()
  const { isPending, isError, refetch } = affiliate
    ? useCustomizationSync(orgId, "dashboard")
    : { isPending: false, isError: false, refetch: () => {} }
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName,
      email: initialEmail,
      paypalEmail: initialPaypalEmail,
    },
  })
  const currentPasswordForm = useForm({
    resolver: zodResolver(currentPasswordSchema),
    defaultValues: {
      currentPassword: "",
    },
  })
  const newPasswordForm = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })
  const currentName = profileForm.watch("name")
  const currentEmail = profileForm.watch("email")
  const currentPaypalEmail = profileForm.watch("paypalEmail")
  const isFormUnchanged =
    currentName.trim() === initialName.trim() &&
    currentEmail.trim() === initialEmail.trim() &&
    currentPaypalEmail.trim() === initialPaypalEmail.trim()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [step, setStep] = useState<"current" | "new">("current")
  const { showCustomToast } = useCustomToast()
  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      if (isPreview) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true }), 1000)
        )
      }
      return AffiliateData
        ? updateAffiliateProfile(orgId, data)
        : updateUserProfile(orgId, data)
    },
    onSuccess: () => {
      showCustomToast({
        type: "success",
        title: "Profile updated successfully",
        description: "Your profile was updated.",
        affiliate,
      })
    },
    onError: (err: any) => {
      showCustomToast({
        type: "error",
        title: "Update Error",
        description: err.message ?? "Something went wrong.",
        affiliate,
      })
    },
  })

  const validatePassword = useMutation({
    mutationFn: async (password: string) => {
      if (isPreview) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ok: password === "correct123" }), 1000)
        )
      }

      return AffiliateData
        ? validateCurrentPassword(password)
        : validateCurrentSellerPassword(password)
    },
    onSuccess: (res: any) => {
      if (res?.ok) {
        setStep("new")
        newPasswordForm.reset({ newPassword: "", confirmPassword: "" })
        showCustomToast({
          type: "success",
          title: "Password validated",
          description: "Enter your new password below.",
          affiliate,
        })
      } else {
        showCustomToast({
          type: "error",
          title: "Invalid Password",
          description: "Incorrect password.",
          affiliate,
        })
      }
    },
    onError: () => {
      showCustomToast({
        type: "error",
        title: "Something went wrong",
        description: "Unexpected error. Please try again.",
        affiliate,
      })
    },
  })

  const updatePassword = useMutation({
    mutationFn: async (newPassword: string) => {
      if (isPreview) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true }), 1000)
        )
      }

      return AffiliateData
        ? updateAffiliatePassword(newPassword)
        : updateUserPassword(newPassword)
    },
    onSuccess: (res: any) => {
      if (res?.ok) {
        showCustomToast({
          type: "success",
          title: "Password updated successfully",
          description: "You can now use your new password.",
          affiliate,
        })
        resetPasswordModal()
      } else {
        showCustomToast({
          type: "error",
          title: "Update Failed",
          description: "Unable to change password.",
          affiliate,
        })
      }
    },
    onError: () => {
      showCustomToast({
        type: "error",
        title: "Unexpected Error",
        description: "Please try again later.",
        affiliate,
      })
    },
  })

  const onSubmit = (data: any) => {
    updateProfile.mutate(data)
  }
  const onSubmitValidateCurrent = (data: any) => {
    validatePassword.mutate(data.currentPassword)
  }
  const onSubmitUpdatePassword = (data: any) => {
    updatePassword.mutate(data.newPassword)
  }

  const resetPasswordModal = () => {
    setShowPasswordModal(false)
    setStep("current")
    currentPasswordForm.reset()
    newPasswordForm.reset()
  }
  if (isPending) {
    return <PendingState withoutBackground />
  }
  if (isError) {
    return <ErrorState onRetry={refetch} />
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div>
            <div className="flex flex-row gap-2 items-center">
              <h1
                className="text-3xl font-bold"
                style={{
                  color:
                    (affiliate && dashboardTheme.dashboardHeaderNameColor) ||
                    undefined,
                }}
              >
                Profile Settings
              </h1>
              {isPreview && (
                <DashboardThemeCustomizationOptions
                  name="dashboardHeaderNameColor"
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p
                className="text-muted-foreground"
                style={{
                  color:
                    (affiliate && dashboardTheme.dashboardHeaderDescColor) ||
                    undefined,
                }}
              >
                Manage your account information
              </p>
              {isPreview && (
                <DashboardThemeCustomizationOptions
                  name="dashboardHeaderDescColor"
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Card
        className="relative"
        style={{
          backgroundColor:
            (affiliate && dashboardCard.dashboardCardBackgroundColor) ||
            undefined,
          boxShadow:
            affiliate &&
            dashboardCard.dashboardCardShadow &&
            dashboardCard.dashboardCardShadow !== "none"
              ? affiliate &&
                getShadowWithColor(
                  toValidShadowSize(dashboardCard.dashboardCardShadowThickness),
                  dashboardCard.dashboardCardShadowColor
                )
              : "",
          border:
            affiliate && dashboardCard.dashboardCardBorder
              ? `1px solid ${
                  affiliate && dashboardCard.dashboardCardBorderColor
                }`
              : "none",
        }}
      >
        {isPreview && (
          <div className="absolute bottom-0 left-0 p-2">
            <DashboardCardCustomizationOptions
              triggerSize="w-6 h-6"
              dropdownSize="w-[150px]"
            />
          </div>
        )}{" "}
        <CardHeader>
          <div className="flex flex-row gap-2 items-center">
            <CardTitle
              style={{
                color:
                  (affiliate && dashboardTheme.cardHeaderPrimaryTextColor) ||
                  undefined,
              }}
            >
              Account Information
            </CardTitle>
            {isPreview && (
              <DashboardThemeCustomizationOptions
                name="cardHeaderPrimaryTextColor"
                buttonSize="w-4 h-4"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <Form {...profileForm}>
            <form
              id="profile-form"
              onSubmit={profileForm.handleSubmit(onSubmit)}
              className="space-y-6 relative"
            >
              {isPreview && (
                <div className="absolute top-0 left-[16rem]">
                  <InputCustomizationOptions size="w-6 h-6" />
                </div>
              )}
              <InputField
                control={profileForm.control}
                name="name"
                label="Username"
                placeholder="Enter your name"
                type="text"
                icon={User}
                profile
                affiliate={affiliate}
              />

              <InputField
                control={profileForm.control}
                name="email"
                label="Email Address"
                placeholder="john@example.com"
                type="email"
                icon={Mail}
                profile
                affiliate={affiliate}
              />
              <InputField
                control={profileForm.control}
                name="paypalEmail"
                label="PayPal Email"
                placeholder="Enter your PayPal email"
                type="email"
                profile
                affiliate={affiliate}
              />
              <div>
                <div className="flex flex-row items-center justify-between mb-4 gap-1">
                  <Separator
                    className="flex-1"
                    style={{
                      backgroundColor:
                        (affiliate && dashboardTheme.separatorColor) ||
                        "#e5e7eb",
                    }}
                  />
                  {isPreview && (
                    <DashboardThemeCustomizationOptions
                      name="separatorColor"
                      buttonSize="w-4 h-4"
                    />
                  )}
                </div>

                <div className="flex flex-row gap-2 mt-4 ">
                  <h3
                    className="font-medium mb-4"
                    style={{
                      color:
                        (affiliate &&
                          dashboardTheme.cardHeaderSecondaryTextColor) ||
                        undefined,
                    }}
                  >
                    Password
                  </h3>
                  {isPreview && (
                    <DashboardThemeCustomizationOptions
                      name="cardHeaderSecondaryTextColor"
                      buttonSize="w-4 h-4"
                    />
                  )}
                </div>

                <Button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  style={{
                    backgroundColor:
                      (affiliate &&
                        dashboardButton.dashboardButtonBackgroundColor) ||
                      undefined,
                    color:
                      (affiliate && dashboardButton.dashboardButtonTextColor) ||
                      undefined,
                  }}
                >
                  Change Password
                </Button>

                <Separator
                  className="flex-1 mt-4"
                  style={{
                    backgroundColor:
                      (affiliate && dashboardTheme.separatorColor) || "#e5e7eb",
                  }}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <div className="flex flex-row gap-2 items-center">
            {isPreview && (
              <DashboardButtonCustomizationOptions triggerSize="w-6 h-6" />
            )}
            <Button
              form="profile-form"
              type="submit"
              disabled={updateProfile.isPending || isFormUnchanged}
              style={{
                backgroundColor:
                  updateProfile.isPending || isFormUnchanged
                    ? (affiliate &&
                        dashboardButton.dashboardButtonDisabledBackgroundColor) ||
                      undefined
                    : (affiliate &&
                        dashboardButton.dashboardButtonBackgroundColor) ||
                      undefined,
                color:
                  updateProfile.isPending || isFormUnchanged
                    ? (affiliate &&
                        dashboardButton.dashboardButtonDisabledTextColor) ||
                      undefined
                    : (affiliate && dashboardButton.dashboardButtonTextColor) ||
                      undefined,
              }}
            >
              {updateProfile.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showPasswordModal} onOpenChange={resetPasswordModal}>
        <DialogContent affiliate={affiliate}>
          <DialogHeader>
            {isPreview && (
              <div className="absolute bottom-0 left-0 p-2">
                <DialogCustomizationOptions triggerSize="w-6 h-6" />
              </div>
            )}
            <DialogTitle
              style={{
                color:
                  (affiliate && dashboardTheme.dialogHeaderColor) || undefined,
              }}
            >
              <div className="flex flex-row gap-2 items-center">
                {step === "current"
                  ? "Verify Current Password"
                  : "Set New Password"}
                {isPreview && (
                  <DashboardThemeCustomizationOptions
                    name="dialogHeaderColor"
                    buttonSize="w-4 h-4"
                  />
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {step === "current" ? (
            <Form {...currentPasswordForm}>
              <form
                onSubmit={currentPasswordForm.handleSubmit(
                  onSubmitValidateCurrent
                )}
                className=" relative space-y-4"
              >
                {isPreview && (
                  <div className="absolute top-[20px] right-0 z-50">
                    <InputCustomizationOptions size="w-6 h-6" />
                  </div>
                )}
                <InputField
                  control={currentPasswordForm.control}
                  name="currentPassword"
                  label="Current Password"
                  placeholder="Enter current password"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  affiliate={affiliate}
                />
                <DialogFooter>
                  <div className="flex flex-row gap-2 items-center">
                    {isPreview && (
                      <DashboardButtonCustomizationOptions triggerSize="w-6 h-6" />
                    )}
                    <Button
                      type="submit"
                      disabled={validatePassword.isPending}
                      style={{
                        backgroundColor: validatePassword.isPending
                          ? (affiliate &&
                              dashboardButton.dashboardButtonDisabledBackgroundColor) ||
                            undefined
                          : (affiliate &&
                              dashboardButton.dashboardButtonBackgroundColor) ||
                            undefined,
                        color: validatePassword.isPending
                          ? (affiliate &&
                              dashboardButton.dashboardButtonDisabledTextColor) ||
                            undefined
                          : (affiliate &&
                              dashboardButton.dashboardButtonTextColor) ||
                            undefined,
                      }}
                    >
                      {validatePassword.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Validating
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <Form {...newPasswordForm}>
              <form
                key={step}
                onSubmit={newPasswordForm.handleSubmit(onSubmitUpdatePassword)}
                className="space-y-4 relative"
              >
                {isPreview && (
                  <div className="absolute top-[20px] right-0 z-50">
                    <InputCustomizationOptions size="w-6 h-6" />
                  </div>
                )}
                <InputField
                  control={newPasswordForm.control}
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  type="password"
                  icon={Lock}
                  showPasswordToggle
                  affiliate={affiliate}
                />

                <InputField
                  control={newPasswordForm.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  type="password"
                  icon={Lock}
                  showPasswordToggle
                  affiliate={affiliate}
                />

                <DialogFooter>
                  <div className="flex flex-row gap-2 items-center">
                    {isPreview && (
                      <DashboardButtonCustomizationOptions triggerSize="w-6 h-6" />
                    )}
                    <Button
                      type="submit"
                      disabled={updatePassword.isPending}
                      style={{
                        backgroundColor: updatePassword.isPending
                          ? (affiliate &&
                              dashboardButton.dashboardButtonDisabledBackgroundColor) ||
                            undefined
                          : (affiliate &&
                              dashboardButton.dashboardButtonBackgroundColor) ||
                            undefined,
                        color: updatePassword.isPending
                          ? (affiliate &&
                              dashboardButton.dashboardButtonDisabledTextColor) ||
                            undefined
                          : (affiliate &&
                              dashboardButton.dashboardButtonTextColor) ||
                            undefined,
                      }}
                    >
                      {updatePassword.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
