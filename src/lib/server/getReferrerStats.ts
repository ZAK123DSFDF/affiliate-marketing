import { db } from "@/db/drizzle";
import { affiliateClick } from "@/db/schema";
import { inArray, sql } from "drizzle-orm";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";

export async function getReferrerStats(
  linkIds: string[],
  year?: number,
  month?: number,
) {
  return db
    .select({
      referrer: affiliateClick.referrer,
      clicks: sql<number>`COUNT(*)`.mapWith(Number),
    })
    .from(affiliateClick)
    .where(
      buildWhereWithDate(
        [inArray(affiliateClick.affiliateLinkId, linkIds)],
        affiliateClick,
        year,
        month,
      ),
    )
    .groupBy(affiliateClick.referrer);
}
