"use client"

import React, { useMemo, useState } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

import {
  logoutAction,
  updateAffiliatePassword,
  updateAffiliateProfile,
  validateCurrentPassword,
} from "@/app/affiliate/[orgId]/dashboard/profile/action"
import {
  updateUserPassword,
  updateUserProfile,
  validateCurrentSellerPassword,
} from "@/app/(seller)/seller/[orgId]/dashboard/profile/action"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  affiliateProfileSchema,
  userProfileSchema,
} from "@/lib/schema/profileSchema"
import {
  currentPasswordSchema,
  newPasswordSchema,
} from "@/lib/schema/passwordSchema"
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import ProfileHeader from "@/components/pages/Dashboard/Profile/ProfileHeader"
import ProfileCardHeader from "@/components/pages/Dashboard/Profile/ProfileCardHeader"
import ProfileCardContent from "@/components/pages/Dashboard/Profile/ProfileCardContent"
import ProfileCardFooter from "@/components/pages/Dashboard/Profile/ProfileCardFooter"
import ProfileDialog from "@/components/pages/Dashboard/Profile/ProfileDialog"
import { ProfileProps } from "@/lib/types/profileTypes"
import { useDashboardCard } from "@/hooks/useDashboardCard"
import deepEqual from "fast-deep-equal"
import { Button } from "@/components/ui/button"
import ProfileEmailDialog from "@/components/ui-custom/ProfileEmailDialog"
import {
  requestAffiliateEmailChange,
  requestSellerEmailChange,
} from "@/lib/server/requestEmailChange"

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
  const profileForm = useForm({
    resolver: zodResolver(
      affiliate ? affiliateProfileSchema : userProfileSchema
    ),
    defaultValues: affiliate
      ? {
          name: initialName,
          email: initialEmail,
          paypalEmail: initialPaypalEmail,
        }
      : {
          name: initialName,
          email: initialEmail,
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
  const safeDefaults = useMemo(() => {
    if (affiliate) {
      return {
        name: initialName,
        email: initialEmail,
        paypalEmail: initialPaypalEmail,
      }
    }
    return {
      name: initialName,
      email: initialEmail,
    }
  }, [initialName, initialEmail, initialPaypalEmail])

  const currentValues = profileForm.watch()

  const isFormUnchanged = useMemo(() => {
    return deepEqual(currentValues, safeDefaults)
  }, [currentValues, safeDefaults])
  const dashboardCardStyle = useDashboardCard(affiliate)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [step, setStep] = useState<"current" | "new">("current")
  const { showCustomToast } = useCustomToast()
  const updateProfile = useMutation({
    mutationFn: async (data: {
      name?: string
      email?: string
      paypalEmail?: string
    }) => {
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
        ? validateCurrentPassword(orgId, password)
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
        ? updateAffiliatePassword(orgId, newPassword)
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
  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (isPreview) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true }), 1000)
        )
      }
      return logoutAction(affiliate, orgId)
    },
    onSuccess: (res: any) => {
      if (res.redirectTo) {
        window.location.href = res.redirectTo
      }
    },
    onError: (err: any) => {
      showCustomToast({
        type: "error",
        title: "Logout failed",
        description: err.message ?? "Could not log you out.",
        affiliate,
      })
    },
  })
  const emailChangeMutation = useMutation({
    mutationFn: async (values: { newEmail: string }) => {
      if (isPreview) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true }), 1000)
        )
      }

      if (affiliate) {
        return requestAffiliateEmailChange({
          affiliateId: AffiliateData?.id!,
          newEmail: values.newEmail,
          orgId,
        })
      } else {
        return requestSellerEmailChange({
          userId: UserData?.id!,
          newEmail: values.newEmail,
        })
      }
    },
    onSuccess: (res: any) => {
      if (res?.ok) {
        showCustomToast({
          type: "success",
          title: "Email change requested",
          description: "Check your new email inbox for verification link",
          affiliate,
        })
      } else {
        showCustomToast({
          type: "error",
          title: "Email change failed",
          description: res.error ?? "Something went wrong.",
          affiliate,
        })
      }
      setShowEmailDialog(false)
    },
    onError: (err: any) => {
      showCustomToast({
        type: "error",
        title: "Email change failed",
        description: err.message ?? "Unexpected error.",
        affiliate,
      })
      setShowEmailDialog(false)
    },
  })
  const onSubmit = (data: typeof safeDefaults) => {
    const changed = (Object.keys(data) as (keyof typeof data)[]).reduce(
      (acc, key) => {
        if (!deepEqual(data[key], safeDefaults[key])) {
          acc[key] = data[key]
        }
        return acc
      },
      {} as Partial<typeof data>
    )

    if (Object.keys(changed).length === 0) return

    updateProfile.mutate(changed)
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
  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader affiliate={affiliate} isPreview={isPreview} />

      <Card className="relative" style={dashboardCardStyle}>
        {isPreview && (
          <div className="absolute bottom-0 left-0 p-2">
            <DashboardCardCustomizationOptions
              triggerSize="w-6 h-6"
              dropdownSize="w-[150px]"
            />
          </div>
        )}{" "}
        <CardHeader>
          <ProfileCardHeader affiliate={affiliate} isPreview={isPreview} />
        </CardHeader>
        <CardContent className="space-y-8">
          <ProfileCardContent
            profileForm={profileForm}
            onSubmit={onSubmit}
            setShowPasswordModal={setShowPasswordModal}
            setShowEmailDialog={setShowEmailDialog}
            affiliate={affiliate}
            isPreview={isPreview}
            data={{
              canChangeEmail: affiliate
                ? AffiliateData?.canChangeEmail
                : UserData?.canChangeEmail,
              canChangePassword: affiliate
                ? AffiliateData?.canChangePassword
                : UserData?.canChangePassword,
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-end pt-6 space-x-3">
          <ProfileCardFooter
            updateProfile={updateProfile}
            isFormUnchanged={isFormUnchanged}
            affiliate={affiliate}
            isPreview={isPreview}
          />
          <Button
            variant="destructive"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </CardFooter>
      </Card>
      <ProfileDialog
        showPasswordModal={showPasswordModal}
        resetPasswordModal={resetPasswordModal}
        currentPasswordForm={currentPasswordForm}
        newPasswordForm={newPasswordForm}
        onSubmitValidateCurrent={onSubmitValidateCurrent}
        onSubmitUpdatePassword={onSubmitUpdatePassword}
        validatePassword={validatePassword}
        updatePassword={updatePassword}
        step={step}
        affiliate={affiliate}
        isPreview={isPreview}
      />
      <ProfileEmailDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        affiliate={affiliate}
        onSubmit={(values) => {
          emailChangeMutation.mutate(values)
        }}
      />
    </div>
  )
}
