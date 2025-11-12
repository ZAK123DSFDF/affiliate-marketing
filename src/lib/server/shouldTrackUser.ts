import { db } from "@/db/drizzle"
import { organization, subscription, purchase } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export async function shouldTrackUser(orgId: string) {
  // 1️⃣ Find the organization first
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
  })

  if (!org) {
    console.warn("⚠️ No organization found — skipping tracking")
    return false
  }

  // 2️⃣ Run both queries in parallel (subscription + purchase)
  const [userSub, userPurchase] = await Promise.all([
    db.query.subscription.findFirst({
      where: eq(subscription.userId, org.userId),
    }),
    db.query.purchase.findFirst({
      where: eq(purchase.userId, org.userId),
      orderBy: desc(purchase.createdAt),
    }),
  ])

  // 3️⃣ If user has neither subscription nor purchase → unknown → don't track
  if (!userSub && !userPurchase) {
    return false
  }

  // 4️⃣ Handle PURCHASE (always tracked)
  if (userPurchase) {
    return true
  }

  // 5️⃣ Handle SUBSCRIPTION (Free, Pro, Ultimate)
  if (userSub) {
    const isExpired =
      !!userSub.expiresAt && new Date(userSub.expiresAt) < new Date()

    // 🧩 Free tier with expiry = untracked
    if (userSub.plan === "FREE") {
      return !isExpired // valid free → tracked, expired free → untracked
    }

    // 🧩 PRO / ULTIMATE → tracked if valid
    return !isExpired
  }

  // Fallback (should never hit)
  return false
}
