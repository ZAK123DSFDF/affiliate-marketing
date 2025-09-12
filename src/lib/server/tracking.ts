import { db } from "@/db/drizzle"
import { subscription, userToOrganization } from "@/db/schema"
import { eq } from "drizzle-orm"
import { convertUsdToCurrency } from "@/util/Currency"
import { getAffiliateTotalEarnings } from "@/lib/server/affiliateInvoice"

const FREE_PLAN_LIMIT_USD = 1000

export async function shouldTrackTransaction(
  userId: string,
  affiliateLinkId: string
): Promise<boolean> {
  const userSub = await db.query.subscription.findFirst({
    where: eq(subscription.userId, userId),
  })
  if (!userSub) {
    console.warn("⚠️ No subscription found, treating user as FREE plan")
    const userOrg = await db.query.userToOrganization.findFirst({
      where: eq(userToOrganization.userId, userId),
      with: {
        organization: true,
      },
    })

    const orgCurrency = userOrg?.organization.currency || "USD"
    const limit = await convertUsdToCurrency(FREE_PLAN_LIMIT_USD, orgCurrency)
    const total = await getAffiliateTotalEarnings(affiliateLinkId)

    return total <= limit
  }

  return true
}
