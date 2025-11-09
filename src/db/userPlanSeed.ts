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
  plan: "FREE" | "PRO" | "ULTIMATE" | "ONE_TIME_100" | "ONE_TIME_200"
  type: "FREE" | "SUBSCRIPTION" | "PURCHASE"
}) {
  try {
    // 🧹 Clean previous state first (always)
    await db.delete(subscription).where(eq(subscription.userId, userId))
    await db.delete(purchase).where(eq(purchase.userId, userId))

    if (type === "SUBSCRIPTION") {
      await db.insert(subscription).values({
        userId,
        plan: plan === "ULTIMATE" ? "ULTIMATE" : "PRO", // just to be safe
        billingInterval: "MONTHLY",
        currency: "USD",
        price: plan === "ULTIMATE" ? "2000" : "1000",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      })
    } else if (type === "PURCHASE") {
      await db.insert(purchase).values({
        userId,
        tier: plan as "ONE_TIME_100" | "ONE_TIME_200",
        price: plan === "ONE_TIME_100" ? "100" : "200",
        currency: "USD",
      })
    } else {
      // If it's a free plan, we just leave the user with no paid records
      console.info(`🆓 User ${userId} set to FREE plan.`)
      return true
    }

    console.info(
      `✅ Successfully set ${type} plan "${plan}" for user ${userId}`
    )
    return true
  } catch (error) {
    console.error(
      `❌ Failed to set ${type} plan "${plan}" for user ${userId}`,
      error
    )
    return false
  }
}

// --- CLI support ---
const DEV_USER_ID = "29022934-eb52-49af-aca4-b6ed553c89dd"

// args: plan type [userId?]
const [, , plan, type, userIdArg] = process.argv

if (!plan || !type) {
  console.error("Usage: bun run src/db/userPlanSeed.ts <plan> <type> [userId]")
  process.exit(1)
}

const userId = userIdArg || DEV_USER_ID

const success = await devSetUserPlan({
  userId,
  plan: plan as any,
  type: type as any,
})

if (!success) process.exit(1)
