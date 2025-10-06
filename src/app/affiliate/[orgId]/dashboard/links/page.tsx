import React from "react"
import Links from "@/components/pages/AffiliateDashboard/Links/Links"
import { OrgIdProps } from "@/lib/types/orgId"
import { MissingPaypalEmailCard } from "@/components/ui-custom/MissingPayoutEmailCard"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireAffiliateWithOrg } from "@/lib/server/authGuards"

const linksPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  return (
    <div className="space-y-6">
      <MissingPaypalEmailCard affiliate orgId={orgId} />
      <Links orgId={orgId} affiliate />
    </div>
  )
}
export default linksPage
