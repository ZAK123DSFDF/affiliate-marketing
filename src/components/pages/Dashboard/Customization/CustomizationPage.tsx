"use client";
import React, { useState, useMemo, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function CustomizationPage({ orgId }: { orgId: string }) {
  const [mainTab, setMainTab] = useState("sidebar");
  // Watch store changes so we can reactively compute payload
  const authChangesState = useAuthCustomizationChangesStore((s) => s.changes);
  const dashboardChangesState = useDashboardCustomizationChangesStore(
    (s) => s.changes,
  );
  const payload = useMemo(() => {
    const authChanges = getAuthCustomizationChanges();
    const dashboardChanges = getDashboardCustomizationChanges();
    const result: Record<string, any> = {};
    if (Object.keys(authChanges).length > 0) result.auth = authChanges;
    if (Object.keys(dashboardChanges).length > 0)
      result.dashboard = dashboardChanges;
    return result;
  }, [authChangesState, dashboardChangesState]);

  const hasChanges = Object.keys(payload).length > 0;

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("🟢 Changes before send:", payload);
      if (!hasChanges) {
        console.log("⚪ No changes to save");
        return { success: true };
      }
      return await saveCustomizationsAction(orgId, payload);
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
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.size > 0) {
      router.replace("?", { scroll: false });
    }
  }, []);
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
          <DashboardCustomization orgId={orgId} />
        </TabsContent>
        <TabsContent value="auth">
          <AuthCustomization orgId={orgId} setMainTab={setMainTab} />
        </TabsContent>
      </Tabs>

      <div className="pt-4">
        <Button
          onClick={() => mutation.mutate()}
          disabled={!hasChanges || mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Customizations"}
        </Button>
      </div>
    </div>
  );
}
