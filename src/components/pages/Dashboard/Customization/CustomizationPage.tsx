"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AuthCustomization } from "@/components/pages/Dashboard/Customization/AuthCustomization";
import { DashboardCustomization } from "@/components/pages/Dashboard/Customization/DashboardCustomization";
import { ToastPreview } from "@/components/ui-custom/ToastPreview";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { useToastCustomizationOption } from "@/hooks/useDashboardCustomization";
import { ToastCustomization } from "@/components/ui-custom/Customization/ToastCustomization";
import { useMutation } from "@tanstack/react-query";
import { saveCustomizationsAction } from "@/app/seller/[orgId]/dashboard/customization/action";
import { getAuthCustomizationChanges } from "@/util/AuthCustomizationChanges";
import { useAuthCustomizationChangesStore } from "@/store/AuthCustomizationChangesStore";

export default function CustomizationPage() {
  const [mainTab, setMainTab] = useState("sidebar");
  const mutation = useMutation({
    mutationFn: async () => {
      const data = getAuthCustomizationChanges();
      console.log("🟢 Changes before send:", data);
      return await saveCustomizationsAction(data);
    },
    onSuccess: () => {
      console.log("✅ Customizations saved");
      useAuthCustomizationChangesStore.getState().resetChanges();
    },
    onError: (error) => {
      console.error("❌ Save failed:", error);
    },
  });

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
        <ToastCustomization />
      </div>
      Tabs
      <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
          <TabsTrigger value="auth">Auth Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="sidebar">
          <DashboardCustomization />
        </TabsContent>
        <TabsContent value="auth">
          <AuthCustomization setMainTab={setMainTab} />
        </TabsContent>
      </Tabs>
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => mutation.mutate()}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Customizations"}
        </button>
      </div>
    </div>
  );
}
