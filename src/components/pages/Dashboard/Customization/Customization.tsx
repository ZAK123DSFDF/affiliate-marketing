"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayoutPreview } from "@/components/pages/Dashboard/Customization/DashboardLayoutPreview";
import AffiliateDashboardSidebar from "@/components/AffiliateDashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import PaymentTable from "@/components/pages/AffiliateDashboard/Payment/Payment";
import {
  dummyAffiliateLinks,
  dummyAffiliatePayments,
} from "@/lib/types/previewData";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import Dashboard from "@/components/pages/Dashboard/Dashboard";

export function CustomizationForm() {
  const [colors, setColors] = useState({
    sidebarBackgroundColor: "#1F2937",
    sidebarTextColor: "#F9FAFB",
    sidebarButtonColor: "#4F46E5",
    sidebarButtonHoverColor: "#6366F1",
    sidebarButtonActiveColor: "#4338CA",
    sidebarProfileHoverColor: "#D97706",
    sidebarProfileActiveColor: "#B45309",
  });
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const handleChange = (key: keyof typeof colors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };
  const params = useParams();
  const orgId = params?.orgId as string; // from [id] in the route

  if (!orgId) {
    return <div className="text-red-500">Invalid organization ID</div>;
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            <Input
              id={key}
              type="color"
              value={value}
              onChange={(e) =>
                handleChange(key as keyof typeof colors, e.target.value)
              }
            />
          </div>
        ))}
      </div>
      <div className="border rounded-xl overflow-hidden shadow-lg ring ring-muted bg-background max-w-5xl h-[500px] mx-auto relative">
        <div className="flex h-full">
          <AffiliateDashboardSidebar
            orgId={orgId}
            isPreview
            currentPage={selectedPage}
            onSelectPage={(page: any) => setSelectedPage(page)}
          />
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedPage === "dashboard" && <Dashboard />}
            {selectedPage === "links" && (
              <Links isPreview data={dummyAffiliateLinks} />
            )}
            {selectedPage === "payment" && (
              <PaymentTable isPreview data={dummyAffiliatePayments} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
