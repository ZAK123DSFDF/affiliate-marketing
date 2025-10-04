"use client"
import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AuthCustomization } from "@/components/pages/Dashboard/Customization/AuthCustomization"
import { DashboardCustomization } from "@/components/pages/Dashboard/Customization/DashboardCustomization"
import { ToastCustomization } from "@/components/ui-custom/Customization/ToastCustomization"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { saveCustomizationsAction } from "@/app/(seller)/seller/[orgId]/dashboard/customization/action"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useAtomValue } from "jotai"
import { authHasChangesAtom } from "@/store/AuthChangesAtom"
import { dashboardHasChangesAtom } from "@/store/DashboardChangesAtom"
import { useLiveCustomizations } from "@/store/LiveCustomizationAtom"
import { GlobalCustomizationProvider } from "@/components/pages/Dashboard/Customization/GlobalCustomizationProvider"
import { Organization } from "@/lib/types/orgAuth"

export default function CustomizationPage({
  orgId,
  org,
}: {
  orgId: string
  org?: Organization
}) {
  const [mainTab, setMainTab] = useState("sidebar")

  const authHasChanges = useAtomValue(authHasChangesAtom)
  const dashboardHasChanges = useAtomValue(dashboardHasChangesAtom)

  const hasChanges = authHasChanges || dashboardHasChanges
  const liveCustomizations = useLiveCustomizations()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("🟢 Changes before send:", liveCustomizations)
      if (!hasChanges) {
        console.log("⚪ No changes to save")
        return { success: true }
      }
      return await saveCustomizationsAction(orgId, liveCustomizations)
    },
    onSuccess: () => {
      console.log("✅ Customizations saved")
      queryClient
        .invalidateQueries({
          queryKey: ["customizations", "both", orgId],
        })
        .then(() => console.log("invalidated"))
    },
    onError: (error) => {
      console.error("❌ Save failed:", error)
    },
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.size > 0) {
      router.replace("?", { scroll: false })
    }
  }, [])
  return (
    <GlobalCustomizationProvider orgId={orgId}>
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
            <AuthCustomization
              orgId={orgId}
              org={org}
              setMainTab={setMainTab}
            />
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
    </GlobalCustomizationProvider>
  )
}
