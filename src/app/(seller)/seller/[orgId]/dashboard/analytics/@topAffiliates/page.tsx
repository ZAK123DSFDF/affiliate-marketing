import React from "react"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates"
import { getTopAffiliates } from "@/app/(seller)/seller/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireSellerWithOrg } from "@/lib/server/authGuards"

const topAffiliatesPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  return (
    <>
      <AffiliatesTable
        affiliate={false}
        orgId={orgId}
        cardTitle="Top Affiliates"
        mode="top"
      />
    </>
  )
}
export default topAffiliatesPage
