// lib/server/getAffiliateAuth.ts
"use server"

import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"

import { affiliateAccount } from "@/db/schema"
import { getCurrentAffiliateUser } from "@/lib/server/getCurrrentAffiliateUser"

export async function getAffiliateAuthCapabilities(orgId: string) {
  const { id } = await getCurrentAffiliateUser(orgId)
  if (!id) throw { status: 401, toast: "Unauthorized" }

  const accounts = await db.query.affiliateAccount.findMany({
    where: eq(affiliateAccount.affiliateId, id),
  })

  const hasCredentials = accounts.some((a) => a.provider === "credentials")
  const hasOAuth = accounts.some((a) => a.provider !== "credentials")

  return {
    userId: id,
    hasCredentials,
    hasOAuth,
    canChangePassword: hasCredentials,
    canChangeEmail: hasCredentials && !hasOAuth,
  }
}
