import React from "react"
import Profile from "@/components/pages/Dashboard/Profile/Profile"
import { OrgIdProps } from "@/lib/types/orgId"
import { getUserData } from "@/app/seller/[orgId]/dashboard/profile/action"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const profilePage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const userResponse = await getUserData()
  if (!userResponse.ok) {
    return <ErrorCard message={userResponse.error || "Something went wrong"} />
  }
  return (
    <>
      <Profile affiliate={false} orgId={orgId} UserData={userResponse.data} />
    </>
  )
}
export default profilePage
