import "dotenv/config"
import { db } from "@/db/drizzle"
import { subscription } from "@/db/schema"
import { eq } from "drizzle-orm"

const PADDLE_API = "https://sandbox-api.paddle.com"
const API_KEY = process.env.PADDLE_SECRET_TOKEN!
const NOTIFICATION_SETTING_ID = process.env.PADDLE_NOTIFICATION_SETTING_ID!

const DEV_USER_ID = "29022934-eb52-49af-aca4-b6ed553c89dd"

async function getUserSubscription(userId: string) {
  const sub = await db.query.subscription.findFirst({
    where: eq(subscription.userId, userId),
  })

  if (!sub) throw new Error("❌ No subscription found for user: " + userId)
  return sub
}

function addCycles(date: Date, type: "MONTHLY" | "YEARLY", cycles: number) {
  const newDate = new Date(date)

  if (type === "YEARLY") {
    newDate.setFullYear(newDate.getFullYear() + cycles)
  } else {
    newDate.setMonth(newDate.getMonth() + cycles)
  }

  return newDate
}

async function createSimulation(
  subscriptionId: string,
  nextBilledAt: string,
  currentPeriodStart: string,
  currentPeriodEnd: string,
  cycles: number
) {
  const payload = {
    notification_setting_id: NOTIFICATION_SETTING_ID,
    name: `Simulate ${cycles} billing cycle(s)`,
    type: "subscription.updated",
    payload: {
      id: subscriptionId,
      next_billed_at: nextBilledAt,
      current_billing_period: {
        starts_at: currentPeriodStart,
        ends_at: currentPeriodEnd,
      },
    },
  }

  const res = await fetch(`${PADDLE_API}/simulations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  const json = await res.json()
  if (!json.data) {
    console.log("Create simulation error:", json)
    throw new Error("Failed to create simulation")
  }

  return json.data.id
}

async function runSimulation(simulationId: string) {
  const res = await fetch(`${PADDLE_API}/simulations/${simulationId}/runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })

  const json = await res.json()
  return json.data
}

async function main() {
  const cycles = Number(process.argv[2]) || 1
  const userId = process.argv[3] || DEV_USER_ID

  console.log(`\n▶ Using userId: ${userId}`)
  console.log(`▶ Simulating ${cycles} billing cycle(s)\n`)

  const sub = await getUserSubscription(userId)

  const isYearly = sub.billingInterval === "YEARLY"
  console.log(`Current subscription type: ${sub.billingInterval}`)

  if (!sub.expiresAt) {
    throw new Error("❌ Subscription has no expiresAt / next billing date")
  }

  const oldNextBill: Date = sub.expiresAt
  const newNextBill = addCycles(
    oldNextBill,
    isYearly ? "YEARLY" : "MONTHLY",
    cycles
  )

  const periodStart = oldNextBill.toISOString()
  const periodEnd = newNextBill.toISOString()

  console.log("New next_billed_at:", periodEnd)
  console.log("New start:", periodStart)
  console.log("New end:", periodEnd)

  const simulationId = await createSimulation(
    sub.id,
    periodEnd,
    periodStart,
    periodEnd,
    cycles
  )

  console.log("Simulation created:", simulationId)

  const result = await runSimulation(simulationId)
  console.log("\n🎉 Simulation run complete!")
  console.log(result)
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message)
})
