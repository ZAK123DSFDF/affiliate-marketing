import React from "react"
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates"
import { getAffiliatesWithStats } from "@/app/seller/[orgId]/dashboard/affiliates/action"
import { OrgIdProps } from "@/lib/types/orgId"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"

const affiliatePage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params
  const org = await validateOrg(orgId)

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`)
  }

  const rows = await getAffiliatesWithStats(orgId)
  // Check if the response was successful
  if (!rows.ok) {
    // Handle the error case - you might want to redirect or show an error
    redirect(`/error?message=${encodeURIComponent(rows.error)}`)
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
