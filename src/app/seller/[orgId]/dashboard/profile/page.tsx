import React from "react"
import Profile from "@/components/pages/Dashboard/Profile/Profile"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"
import { getUserData } from "@/app/seller/[orgId]/dashboard/profile/action"

const profilePage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params
  const org = await validateOrg(orgId)

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`)
  }

  const userResponse = await getUserData()
  if (!userResponse.ok) {
    redirect(`/error?message=${encodeURIComponent(userResponse.error)}`)
  }
  return (
    <>
      <Profile affiliate={false} orgId={orgId} UserData={userResponse.data} />
    </>
  )
}
export default profilePage
