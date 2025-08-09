"use client";
import { useToastCustomizationOption } from "@/hooks/useDashboardCustomization";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { ToastPreview } from "@/components/ui-custom/ToastPreview";
import React from "react";

type ToastColorKey =
  | "toastTitleColor"
  | "toastDescriptionColor"
  | "toastBackgroundColor"
  | "toastErrorTitleColor"
  | "toastErrorDescriptionColor"
  | "toastErrorBackgroundColor";
const customizationFields: { key: ToastColorKey; label: string }[] = [
  { key: "toastTitleColor", label: "Success Toast Text Color" },
  { key: "toastDescriptionColor", label: "Success Toast Secondary Text" },
  { key: "toastBackgroundColor", label: "Success Toast Background" },
  { key: "toastErrorTitleColor", label: "Error Toast Text Color" },
  { key: "toastErrorDescriptionColor", label: "Error Toast Secondary Text" },
  { key: "toastErrorBackgroundColor", label: "Error Toast Background" },
];
export const ToastCustomization = () => {
  const customization = useToastCustomizationOption();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customizationFields.map(({ key, label }) => (
          <ResettableColorInput
            key={key}
            label={label}
            value={customization[key]}
            onChange={(val) => customization.setToastColor(key, val)}
          />
        ))}
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
  );
};
