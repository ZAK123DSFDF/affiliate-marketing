import React from "react"
import Settings from "@/components/pages/Dashboard/Settings/Settings"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireTeamWithOrg } from "@/lib/server/authGuards"
import { orgTeamInfo } from "@/app/(organization)/organization/[orgId]/teams/dashboard/settings/action"

const SettingsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  const orgResponse = await orgTeamInfo(orgId)
  if (!orgResponse.ok) {
    return <ErrorCard message={orgResponse.error || "Something went wrong"} />
  }

  return <Settings orgData={orgResponse.data} isTeam />
}

export default SettingsPage
