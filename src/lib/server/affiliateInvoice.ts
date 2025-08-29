// lib/affiliateInvoice.ts
import { db } from "@/db/drizzle"
import { affiliateInvoice } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export async function getAffiliateTotalEarnings(
  affiliateLinkId: string
): Promise<number> {
  const result = await db
    .select({
      total: sql<number>`SUM(${affiliateInvoice.amount})::float`,
    })
    .from(affiliateInvoice)
    .where(
      and(
        eq(affiliateInvoice.affiliateLinkId, affiliateLinkId),
        sql`${affiliateInvoice.reason} IN ('subscription_create', 'one_time')`
      )
    )
    .limit(1)

  return result[0]?.total ?? 0
}
