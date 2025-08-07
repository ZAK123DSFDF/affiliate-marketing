"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AuthCustomization } from "@/components/pages/Dashboard/Customization/AuthCustomization";
import { DashboardCustomization } from "@/components/pages/Dashboard/Customization/DashboardCustomization";
import { ToastPreview } from "@/components/ui-custom/ToastPreview";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { useToastCustomizationOption } from "@/hooks/useDashboardCustomization";
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

export default function CustomizationPage() {
  const customization = useToastCustomizationOption();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Customize Your Affiliate Page
        </h2>
        <p className="text-sm text-muted-foreground">
          Adjust colors and layout settings to match your brand.
        </p>
      </div>

      {/* Toast Inputs */}
      <div className="space-y-2">
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sidebar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
          <TabsTrigger value="auth">Auth Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="sidebar">
          <DashboardCustomization />
        </TabsContent>
        <TabsContent value="auth">
          <AuthCustomization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
