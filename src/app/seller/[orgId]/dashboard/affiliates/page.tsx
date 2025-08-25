import React from "react"
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates"
import { getAffiliatesWithStats } from "@/app/seller/[orgId]/dashboard/affiliates/action"
import { OrgIdProps } from "@/lib/types/orgId"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const affiliatePage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })

  const rows = await getAffiliatesWithStats(orgId)
  if (!rows.ok) {
    return <ErrorCard message={rows.error || "Something went wrong"} />
  }
  return (
    <>
      <AffiliatesTable
        affiliate={false}
        orgId={orgId}
        data={rows.data}
        cardTitle="All Affiliates"
        showHeader
      />
    </>
  )
}
export default affiliatePage
