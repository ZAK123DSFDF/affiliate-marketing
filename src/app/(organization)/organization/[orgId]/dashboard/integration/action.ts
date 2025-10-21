"use server"

import { db } from "@/db/drizzle"
import { organizationPaddleAccount } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import { returnError } from "@/lib/errorHandler"
import { MutationData } from "@/lib/types/response"
import { handleAction } from "@/lib/handleAction"

export async function savePaddleWebhookKey({
  orgId,
  webhookPublicKey,
}: {
  orgId: string
  webhookPublicKey: string
}): Promise<MutationData> {
  return handleAction("savePaddleWebhookKey", async () => {
    // 🔐 Authorization
    await getOrgAuth(orgId)

    if (!orgId || !webhookPublicKey) {
      throw { status: 400, toast: "Missing orgId or webhookPublicKey" }
    }

    // 🧩 Ensure webhook key is globally unique
    const existingKey = await db
      .select()
      .from(organizationPaddleAccount)
      .where(eq(organizationPaddleAccount.webhookPublicKey, webhookPublicKey))
      .limit(1)

    if (existingKey.length > 0) {
      throw { status: 409, toast: "This webhook key is already registered" }
    }

    // 🔍 Check if org already has a record
    const existingOrg = await db
      .select()
      .from(organizationPaddleAccount)
      .where(eq(organizationPaddleAccount.orgId, orgId))
      .limit(1)

    if (existingOrg.length > 0) {
      await db
        .update(organizationPaddleAccount)
        .set({
          webhookPublicKey,
          updatedAt: new Date(),
        })
        .where(eq(organizationPaddleAccount.orgId, orgId))
    } else {
      await db.insert(organizationPaddleAccount).values({
        orgId,
        webhookPublicKey,
      })
    }

    return {
      ok: true,
      toast: "✅ Paddle webhook key saved successfully",
    }
  })
}
export async function getOrgWebhookKey(orgId: string) {
  try {
    await getOrgAuth(orgId)

    const existing = await db
      .select({
        webhookPublicKey: organizationPaddleAccount.webhookPublicKey,
      })
      .from(organizationPaddleAccount)
      .where(eq(organizationPaddleAccount.orgId, orgId))
      .limit(1)

    if (existing.length === 0) return { webhookPublicKey: null }

    return { webhookPublicKey: existing[0].webhookPublicKey }
  } catch (err) {
    console.error("getOrgWebhookKey error:", err)
    return { webhookPublicKey: null }
  }
}
export async function deleteOrgPaddleAccount(
  orgId: string
): Promise<MutationData> {
  return handleAction("deletePaddleOrgAccount", async () => {
    await getOrgAuth(orgId)

    await db
      .delete(organizationPaddleAccount)
      .where(eq(organizationPaddleAccount.orgId, orgId))

    return { ok: true }
  })
}
