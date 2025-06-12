// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { validateOrg } from "@/actions/auth/ValidateOrg";
import { notFound, redirect } from "next/navigation";
interface SellerDashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}
export default async function DashboardLayout({
  children,
  params,
}: SellerDashboardLayoutProps) {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    notFound();
  }
  return (
    <SidebarProvider>
      <DashboardSidebar orgId={orgId} />
      <SidebarInset className="bg-background">
        <div className="py-6 px-6 w-full max-w-7xl mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
