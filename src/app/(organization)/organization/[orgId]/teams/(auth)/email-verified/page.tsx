import { redirect } from "next/navigation"
import EmailVerified from "@/components/pages/Email-verified"
import { getOrganizationAuth } from "@/lib/server/getOrganizationAuth"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"
import {
  requireAffiliateWithOrg,
  requireTeamWithOrg,
} from "@/lib/server/authGuards"

export default async function EmailVerifiedPage({ params }: OrgIdProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  return <EmailVerified orgId={orgId} affiliate={false} />
}
