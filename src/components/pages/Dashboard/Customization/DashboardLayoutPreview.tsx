// components/preview/DashboardLayoutPreview.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AffiliateDashboardSidebar from "@/components/AffiliateDashboardSidebar";

interface DashboardLayoutPreviewProps {
  children: React.ReactNode;
  customization: {
    sidebarBackgroundColor: string;
    sidebarTextColor: string;
    sidebarButtonColor: string;
    sidebarButtonHoverColor: string;
    sidebarButtonActiveColor: string;
    sidebarProfileHoverColor: string;
    sidebarProfileActiveColor: string;
  };
}

export const DashboardLayoutPreview = ({
  children,
  customization,
}: DashboardLayoutPreviewProps) => {
  const params = useParams();
  const orgId = params?.orgId as string; // from [id] in the route

  if (!orgId) {
    return <div className="text-red-500">Invalid organization ID</div>;
  }

  return (
    <div className="rounded-xl overflow-hidden ring ring-muted shadow-xl bg-white">
      <div className="flex min-h-[500px] max-h-[600px]">
        {/* Sidebar */}
        <div className="w-[240px] shrink-0">
          <AffiliateDashboardSidebar orgId={orgId} />
        </div>

        {/* Main Content Area */}

        <div className="py-6 px-6">{children}</div>
      </div>
    </div>
  );
};
