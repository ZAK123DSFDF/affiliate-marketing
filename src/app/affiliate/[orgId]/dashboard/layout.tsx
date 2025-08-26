// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { OrgIdProps } from "@/lib/types/orgId"
import AffiliateDashboardSidebar from "@/components/AffiliateDashboardSidebar"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"

interface AffiliateDashboardLayoutProps extends OrgIdProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
  params,
}: AffiliateDashboardLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })

  return (
    <SidebarProvider affiliate orgId={orgId}>
      <AffiliateDashboardSidebar affiliate orgId={orgId} />
      <SidebarInset affiliate className="bg-background">
        <div className="py-6 px-6 w-full max-w-7xl mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
