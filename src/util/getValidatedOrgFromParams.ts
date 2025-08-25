import { notFound } from "next/navigation"
import { validateOrg } from "@/util/ValidateOrg"
import { OrgIdProps } from "@/lib/types/orgId"

export async function getValidatedOrgFromParams({ params }: OrgIdProps) {
  const { orgId } = await params
  const org = await validateOrg(orgId)

  if (!org.orgFound) {
    notFound()
  }

  return orgId
}
