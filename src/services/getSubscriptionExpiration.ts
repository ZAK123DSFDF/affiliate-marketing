import { db } from "@/db/drizzle"

export async function getSubscriptionExpiration(subscriptionId: string) {
  return await db.query.subscriptionExpiration.findFirst({
    where: (exp, { eq }) => eq(exp.subscriptionId, subscriptionId),
  })
}
