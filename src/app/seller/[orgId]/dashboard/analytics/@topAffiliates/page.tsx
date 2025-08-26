import React from "react"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates"
import { getTopAffiliates } from "@/app/seller/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const topAffiliatesPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const TopAffiliates = await getTopAffiliates(orgId)
  if (!TopAffiliates.ok) {
    return <ErrorCard message={TopAffiliates.error || "Something went wrong"} />
  }
  return (
    <>
      <AffiliatesTable
        affiliate={false}
        orgId={orgId}
        data={TopAffiliates.data}
        cardTitle="Top Affiliates"
      />
    </>
  )
}
export default topAffiliatesPage
