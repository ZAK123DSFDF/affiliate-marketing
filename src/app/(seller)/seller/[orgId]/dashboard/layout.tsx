// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SellerDashboardSidebar from "@/components/SellerDashboardSidebar"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
interface SellerDashboardLayoutProps extends OrgIdProps {
  children: React.ReactNode
}
export default async function DashboardLayout({
  children,
  params,
}: SellerDashboardLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  return (
    <SidebarProvider affiliate={false} orgId={orgId}>
      <SellerDashboardSidebar orgId={orgId} />
      <SidebarInset className="bg-background">
        <div className="py-6 px-6 w-full max-w-7xl mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
