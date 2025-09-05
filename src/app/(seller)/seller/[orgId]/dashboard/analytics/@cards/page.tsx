import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import Cards from "@/components/ui-custom/Cards/Cards"
import { getSellerKpiStats } from "@/app/(seller)/seller/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const cardsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const kpiCardStats = await getSellerKpiStats(orgId)
  if (!kpiCardStats.ok) {
    return <ErrorCard message={kpiCardStats.error || "Something went wrong"} />
  }
  return (
    <>
      <Cards orgId={orgId} affiliate={false} kpiCardStats={kpiCardStats.data} />
    </>
  )
}
export default cardsPage
