import { db } from "@/db/drizzle"
export const getOrganization = async (orgId: string) => {
  const org = await db.query.organization.findFirst({
    where: (o, { eq }) => eq(o.id, orgId),
  })
  if (!org) throw new Error("Organization not found")
  return org
}
