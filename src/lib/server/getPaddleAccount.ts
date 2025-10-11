"use server"

import { getOrganizationById } from "@/services/getOrganizationById"
import { db } from "@/db/drizzle"
import { organizationPaddleAccount } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getPaddleAccount = async (orgId: string) => {
  const organizationRecord = await getOrganizationById(orgId)
  if (!organizationRecord) return null

  const [orgPaddleAccount] = await db
    .select()
    .from(organizationPaddleAccount)
    .where(eq(organizationPaddleAccount.orgId, organizationRecord.id))
    .limit(1)

  return orgPaddleAccount ?? null
}
