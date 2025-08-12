"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AuthCustomization } from "@/components/pages/Dashboard/Customization/AuthCustomization";
import { DashboardCustomization } from "@/components/pages/Dashboard/Customization/DashboardCustomization";
import { ToastCustomization } from "@/components/ui-custom/Customization/ToastCustomization";
import { useMutation } from "@tanstack/react-query";
import { saveCustomizationsAction } from "@/app/seller/[orgId]/dashboard/customization/action";
import { getAuthCustomizationChanges } from "@/customization/Auth/AuthCustomizationChanges";
import { useAuthCustomizationChangesStore } from "@/store/AuthCustomizationChangesStore";
import { useDashboardCustomizationChangesStore } from "@/store/DashboardCustomizationChangesStore";
import { getDashboardCustomizationChanges } from "@/customization/Dashboard/DashboardCustomizationChanges";

export default function CustomizationPage() {
  const [mainTab, setMainTab] = useState("sidebar");
  const mutation = useMutation({
    mutationFn: async () => {
      const authChanges = getAuthCustomizationChanges();
      const dashboardChanges = getDashboardCustomizationChanges();
      const payload: Record<string, any> = {};
      if (Object.keys(authChanges).length > 0) {
        payload.auth = authChanges;
      }
      if (Object.keys(dashboardChanges).length > 0) {
        payload.dashboard = dashboardChanges;
      }
      console.log("🟢 Changes before send:", payload);
      if (Object.keys(payload).length === 0) {
        console.log("⚪ No changes to save");
        return { success: true };
      }

      return await saveCustomizationsAction(payload);
    },
    onSuccess: () => {
      console.log("✅ Customizations saved");
      useAuthCustomizationChangesStore.getState().resetChanges();
      useDashboardCustomizationChangesStore.getState().resetChanges();
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
