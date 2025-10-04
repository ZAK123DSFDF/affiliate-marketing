import React from "react"
import { AuthCustomizationProvider } from "./authCustomizationProvider"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrganizationProvider } from "@/components/layout/OrganizationProvider"
import { getOrg } from "@/lib/server/getOrg"
interface authLayoutProps {
  children: React.ReactNode
  params: Promise<{ orgId: string }>
}
export default async function AuthLayout({
  children,
  params,
}: authLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  const org = await getOrg(orgId)
  return (
    <AuthCustomizationProvider orgId={orgId}>
      <OrganizationProvider org={org}>{children}</OrganizationProvider>
    </AuthCustomizationProvider>
  )
}
