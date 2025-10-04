import React from "react"
import CustomizationPage from "@/components/pages/Dashboard/Customization/CustomizationPage"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireSellerWithOrg } from "@/lib/server/authGuards"
import { getOrg } from "@/lib/server/getOrg"

export default async function CustomizationServerPage({ params }: OrgIdProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  const org = await getOrg(orgId)
  return (
    <>
      <CustomizationPage orgId={orgId} org={org} />
    </>
  )
}
