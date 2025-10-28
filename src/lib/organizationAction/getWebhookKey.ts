import { db } from "@/db/drizzle"
import { organizationPaddleAccount } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getWebhookKey(orgId: string) {
  return db
    .select({
      webhookPublicKey: organizationPaddleAccount.webhookPublicKey,
    })
    .from(organizationPaddleAccount)
    .where(eq(organizationPaddleAccount.orgId, orgId))
    .limit(1)
}
