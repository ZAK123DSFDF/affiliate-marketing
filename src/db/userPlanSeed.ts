// scripts/devSetUserPlan.ts
import { db } from "@/db/drizzle"
import { subscription, purchase } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function devSetUserPlan({
  userId,
  plan,
  type,
}: {
  userId: string
  plan: "PRO" | "ULTIMATE" | "ONE_TIME_100" | "ONE_TIME_200"
  type: "SUBSCRIPTION" | "PURCHASE"
}) {
  try {
    if (type === "SUBSCRIPTION") {
      // remove purchases for this user
      await db.delete(purchase).where(eq(purchase.userId, userId))
      // remove existing subscription
      await db.delete(subscription).where(eq(subscription.userId, userId))

      // insert new subscription
      await db.insert(subscription).values({
        userId,
        plan: plan as "PRO" | "ULTIMATE",
        billingInterval: "MONTHLY",
        currency: "USD",
        price: "1000",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
    }

    if (type === "PURCHASE") {
      // remove subscriptions for this user
      await db.delete(subscription).where(eq(subscription.userId, userId))
      // remove existing purchase
      await db.delete(purchase).where(eq(purchase.userId, userId))

      // insert new purchase
      await db.insert(purchase).values({
        userId,
        tier: plan as "ONE_TIME_100" | "ONE_TIME_200",
        price: plan === "ONE_TIME_100" ? "100" : "200",
        currency: "USD",
      })
    }

    console.log(
      `✅ Successfully seeded ${type} plan "${plan}" for user ${userId}`
    )
    return true
  } catch (error) {
    console.error(
      `❌ Failed to seed ${type} plan "${plan}" for user ${userId}`,
      error
    )
    return false
  }
}

// Run script
const success = await devSetUserPlan({
  userId: "29022934-eb52-49af-aca4-b6ed553c89dd",
  plan: "ULTIMATE",
  type: "SUBSCRIPTION",
})

if (!success) {
  process.exit(1) // exit with error for CI/CD
}
