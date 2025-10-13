import React from "react"
import Settings from "@/components/pages/Dashboard/Settings/Settings"
import { orgInfo } from "@/app/(organization)/seller/[orgId]/dashboard/settings/action"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireSellerWithOrg } from "@/lib/server/authGuards"

const SettingsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  const orgResponse = await orgInfo(orgId)
  if (!orgResponse.ok) {
    return <ErrorCard message={orgResponse.error || "Something went wrong"} />
  }

  return <Settings orgData={orgResponse.data} />
}

export default SettingsPage
