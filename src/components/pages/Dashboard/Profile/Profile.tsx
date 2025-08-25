"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

import {
  updateAffiliatePassword,
  updateAffiliateProfile,
  validateCurrentPassword,
} from "@/app/affiliate/[orgId]/dashboard/profile/action"
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
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"
import ProfileHeader from "@/components/pages/Dashboard/Profile/ProfileHeader"
import ProfileCardHeader from "@/components/pages/Dashboard/Profile/ProfileCardHeader"
import ProfileCardContent from "@/components/pages/Dashboard/Profile/ProfileCardContent"
import ProfileCardFooter from "@/components/pages/Dashboard/Profile/ProfileCardFooter"
import ProfileDialog from "@/components/pages/Dashboard/Profile/ProfileDialog"
import { ProfileProps } from "@/lib/types/profileTypes"
import { useDashboardCard } from "@/hooks/useDashboardCard"

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
  const dashboardCardStyle = useDashboardCard(affiliate)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
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
            affiliate={affiliate}
            isPreview={isPreview}
          />
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <ProfileCardFooter
            updateProfile={updateProfile}
            isFormUnchanged={isFormUnchanged}
            affiliate={affiliate}
            isPreview={isPreview}
          />
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
    </div>
  )
}
