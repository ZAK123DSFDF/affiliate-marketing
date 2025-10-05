import React from "react"
import { AuthCustomizationProvider } from "./authCustomizationProvider"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
interface authLayoutProps {
  children: React.ReactNode
  params: Promise<{ orgId: string }>
}
export default async function AuthLayout({
  children,
  params,
}: authLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  return (
    <AuthCustomizationProvider orgId={orgId}>
      {children}
    </AuthCustomizationProvider>
  )
}
