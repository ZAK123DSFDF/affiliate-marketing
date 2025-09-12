// server/getUserPlan.ts
import "server-only"
import { db } from "@/db/drizzle"
import { subscription, purchase } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getOrgAuthForPlan } from "@/lib/server/getOrgAuthForPlan"

export type UserPlanResult =
  | { plan: string; type: "SUBSCRIPTION" | "PURCHASE" }
  | { plan: "FREE" }

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

  if (userSub) {
    return { plan: userSub.plan, type: "SUBSCRIPTION" }
  }

  if (userPurchase) {
    return { plan: userPurchase.tier, type: "PURCHASE" }
  }

  return { plan: "FREE" }
}
