import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"
import { requireOrganizationWithOrg } from "@/lib/server/authGuards"
import IntegrationClientPage from "@/components/pages/Dashboard/Integration/IntegrationClientPage"

export default async function IntegrationPage({ params }: OrgIdProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireOrganizationWithOrg(orgId)

  return <IntegrationClientPage orgId={orgId} />
}
