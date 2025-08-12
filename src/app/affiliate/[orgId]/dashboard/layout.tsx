// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { validateOrg } from "@/util/ValidateOrg";
import { notFound } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";
import AffiliateDashboardSidebar from "@/components/AffiliateDashboardSidebar";
import { getDashboardCustomization } from "@/app/seller/[orgId]/dashboard/customization/action";
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
  const dashboard = await getDashboardCustomization(orgId);
  return (
    <SidebarProvider>
      <AffiliateDashboardSidebar
        dashboard={dashboard}
        affiliate
        orgId={orgId}
      />
      <SidebarInset affiliate className="bg-background">
        <div className="py-6 px-6 w-full max-w-7xl mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
