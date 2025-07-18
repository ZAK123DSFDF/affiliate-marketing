// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import SellerDashboardSidebar from "@/components/SellerDashboardSidebar";
import { validateOrg } from "@/util/ValidateOrg";
import { notFound, redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";
import AffiliateDashboardSidebar from "@/components/AffiliateDashboardSidebar";
interface AffiliateDashboardLayoutProps extends OrgIdProps {
  children: React.ReactNode;
}
export default async function DashboardLayout({
  children,
  params,
}: AffiliateDashboardLayoutProps) {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    notFound();
  }
  return (
    <SidebarProvider>
      <AffiliateDashboardSidebar orgId={orgId} />
      <SidebarInset className="bg-background">
        <div className="py-6 px-6 w-full max-w-7xl mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
