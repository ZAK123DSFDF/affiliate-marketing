import React from "react"
import Profile from "@/components/pages/Dashboard/Profile/Profile"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"
import { getAffiliateData } from "@/app/affiliate/[orgId]/dashboard/profile/action"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const profilePage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const affiliateResponse = await getAffiliateData()
  if (!affiliateResponse.ok) {
    return (
      <ErrorCard message={affiliateResponse.error || "Something went wrong"} />
    )
  }
  return (
    <>
      <Profile orgId={orgId} affiliate AffiliateData={affiliateResponse.data} />
    </>
  )
}
export default profilePage
