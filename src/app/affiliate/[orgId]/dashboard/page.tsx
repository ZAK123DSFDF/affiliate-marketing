// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"

export default async function DashboardPage({ params }: OrgIdProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  redirect(`/affiliate/${orgId}/dashboard/analytics`)
}
