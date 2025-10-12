import InvalidToken from "@/components/pages/InvalidToken"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"

const InvalidTokenPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed(orgId)
  return <InvalidToken orgId={orgId} affiliate />
}

export default InvalidTokenPage
