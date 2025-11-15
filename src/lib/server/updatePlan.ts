// lib/server/updatePlan.ts
import { paddleConfig } from "@/util/PaddleConfig"
import { Paddle, Environment } from "@paddle/paddle-node-sdk"
import { db } from "@/db/drizzle"
import { paddleCustomer, subscription } from "@/db/schema"
import { eq } from "drizzle-orm"

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN!, {
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.production
      : Environment.sandbox,
})

/**
 * Main unified function.
 */
export async function updatePlan({
  subscriptionId,
  targetPlan,
  targetCycle,
  mode,
  modeType,
}: {
  subscriptionId: string
  targetPlan: "PRO" | "ULTIMATE"
  targetCycle?: "MONTHLY" | "YEARLY"
  mode: "PRORATE" | "DO_NOT_BILL"
  modeType: "SUB_TO_SUB" | "SUB_TO_ONE_TIME"
}) {
  if (modeType === "SUB_TO_SUB") {
    return handleSubscriptionToSubscription({
      subscriptionId,
      targetPlan,
      targetCycle: targetCycle!,
      mode: mode!,
    })
  }

  if (modeType === "SUB_TO_ONE_TIME") {
    return handleSubscriptionToOneTime({
      subscriptionId,
      targetPlan,
      mode,
    })
  }

  throw { status: 400, message: "Invalid modeType" }
}

/* -------------------------------------------------------------------------- */
/*   1) SUB → SUB (works & kept as-is, cleaned)                               */
/* -------------------------------------------------------------------------- */

async function handleSubscriptionToSubscription({
  subscriptionId,
  targetPlan,
  targetCycle,
  mode,
}: {
  subscriptionId: string
  targetPlan: "PRO" | "ULTIMATE"
  targetCycle: "MONTHLY" | "YEARLY"
  mode: "PRORATE" | "DO_NOT_BILL"
}) {
  const priceId = paddleConfig.priceIds.SUBSCRIPTION[targetCycle][targetPlan]

  if (!priceId) {
    throw {
      status: 400,
      toast: `Missing priceId for ${targetPlan} ${targetCycle}`,
    }
  }

  const prorationBillingMode =
    mode === "PRORATE" ? "prorated_immediately" : "do_not_bill"

  await paddle.subscriptions.update(subscriptionId, {
    prorationBillingMode,
    items: [
      {
        priceId,
        quantity: 1,
      },
    ],
  })
}

/* -------------------------------------------------------------------------- */
/*   2) SUB → ONE TIME (cancel subscription, then create new transaction)     */
/* -------------------------------------------------------------------------- */

export async function handleSubscriptionToOneTime({
  subscriptionId,
  targetPlan,
  mode,
}: {
  subscriptionId: string
  targetPlan: "PRO" | "ULTIMATE"
  mode: "PRORATE" | "DO_NOT_BILL"
}) {
  const priceId = paddleConfig.priceIds.PURCHASE[targetPlan]
  if (!priceId) {
    throw { status: 400, toast: `Missing one-time price for ${targetPlan}` }
  }

  // 1️⃣ Load subscription
  const sub = await db.query.subscription.findFirst({
    where: eq(subscription.id, subscriptionId),
  })
  if (!sub) {
    throw { status: 400, message: "Subscription not found" }
  }
  const effectiveFrom =
    mode === "PRORATE" ? "immediately" : "next_billing_period"
  // 2️⃣ Cancel subscription immediately (Paddle requirement)
  await paddle.subscriptions.cancel(subscriptionId, {
    effectiveFrom,
  })

  // 3️⃣ Ensure Paddle customer exists
  let customerRow = await db.query.paddleCustomer.findFirst({
    where: eq(paddleCustomer.userId, sub.userId),
  })
  if (!customerRow) {
    throw { status: 400, message: "Paddle customer not found" }
  }
  // 4️⃣ Create Paddle transaction
  await paddle.transactions.create({
    customerId: customerRow.customerId,
    items: [
      {
        priceId,
        quantity: 1,
      },
    ],
  })
}
