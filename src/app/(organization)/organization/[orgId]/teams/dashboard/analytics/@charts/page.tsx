import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart"
import { requireTeamWithOrg } from "@/lib/server/authGuards"

const chartsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  return (
    <>
      <ChartDailyMetrics orgId={orgId} affiliate={false} isTeam />
    </>
  )
}
export default chartsPage
