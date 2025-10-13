import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import Cards from "@/components/ui-custom/Cards/Cards"
import { requireSellerWithOrg } from "@/lib/server/authGuards"

const cardsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  return (
    <>
      <Cards orgId={orgId} affiliate={false} />
    </>
  )
}
export default cardsPage
