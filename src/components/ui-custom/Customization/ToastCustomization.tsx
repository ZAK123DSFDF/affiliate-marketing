"use client"

import React from "react"
import { ToastPreview } from "@/components/ui-custom/ToastPreview"
import { ToastCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/ToastCustomizationOptions"

export const ToastCustomization = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ToastCustomizationOptions name="toastTitleColor" />
        <ToastCustomizationOptions name="toastDescriptionColor" />
        <ToastCustomizationOptions name="toastBackgroundColor" />
        <ToastCustomizationOptions name="toastErrorTitleColor" />
        <ToastCustomizationOptions name="toastErrorDescriptionColor" />
        <ToastCustomizationOptions name="toastErrorBackgroundColor" />
      </div>

      {/* Toast Previews */}
      <ToastPreview
        type="success"
        title="Logged In"
        description="You have successfully logged in."
      />
      <ToastPreview
        type="error"
        title="Login Failed"
        description="The password you entered is incorrect."
      />
    </>
  )
}
