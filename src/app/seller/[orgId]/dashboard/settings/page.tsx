import React from "react"
import Settings from "@/components/pages/Dashboard/Settings/Settings"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { orgInfo } from "@/app/seller/[orgId]/dashboard/settings/action"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const SettingsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const orgResponse = await orgInfo(orgId)
  if (!orgResponse.ok) {
    return <ErrorCard message={orgResponse.error || "Something went wrong"} />
  }

  return <Settings orgData={orgResponse.data} />
}

export default SettingsPage
