"use server"
import { db } from "@/db/drizzle"
import { organization } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Organization } from "@/lib/types/orgAuth"

export const getOrg = async (orgId: string): Promise<Organization> => {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
  })

  if (!org) throw new Error("Organization not found")

  return org
}
