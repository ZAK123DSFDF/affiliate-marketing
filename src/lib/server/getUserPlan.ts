// server/getUserPlan.ts
import "server-only"
import { db } from "@/db/drizzle"
import { subscription, purchase } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getOrgAuthForPlan } from "@/lib/server/getOrgAuthForPlan"

export type UserPlanResult = {
  plan: "FREE" | "PRO" | "ULTIMATE"
  type: "SUBSCRIPTION" | "PURCHASE" | "FREE"
}

function isSubscriptionValid(
  sub: typeof subscription.$inferSelect | null | undefined
) {
  if (!sub) return false
  if (!sub.isActive) return false
  if (!sub.expiresAt) return false
  return sub.expiresAt.getTime() >= Date.now()
}

export async function getUserPlan(): Promise<UserPlanResult> {
  const { userId } = await getOrgAuthForPlan()

  const [userSub, userPurchase] = await Promise.all([
    db.query.subscription.findFirst({
      where: eq(subscription.userId, userId),
    }),
    db.query.purchase.findFirst({
      where: eq(purchase.userId, userId),
    }),
  ])

  // ✅ If user has valid subscription
  if (userSub && isSubscriptionValid(userSub)) {
    return { plan: userSub.plan as "PRO" | "ULTIMATE", type: "SUBSCRIPTION" }
  }

  // ✅ If user has one-time purchase
  if (userPurchase) {
    let mappedPlan: "PRO" | "ULTIMATE" = "PRO"

    if (userPurchase.tier === "ONE_TIME_200") mappedPlan = "ULTIMATE"
    if (userPurchase.tier === "ONE_TIME_100") mappedPlan = "PRO"

    return { plan: mappedPlan, type: "PURCHASE" }
  }

  // ✅ Default free
  return { plan: "FREE", type: "FREE" }
}
