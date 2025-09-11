import InvalidToken from "@/components/pages/InvalidToken"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"

const InvalidTokenPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  return <InvalidToken orgId={orgId} affiliate />
}

export default InvalidTokenPage
