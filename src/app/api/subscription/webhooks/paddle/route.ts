import { Environment, EventName, Paddle } from "@paddle/paddle-node-sdk"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { purchase, subscription } from "@/db/schema"
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm"
const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN!, {
  environment: Environment.sandbox,
})

export async function POST(req: Request) {
  const signature = req.headers.get("paddle-signature") || ""
  const rawBody = await req.text()
  const secretKey = process.env.WEBHOOK_SECRET_KEY || ""

  try {
    if (!signature || !rawBody) {
      console.log("❌ Missing signature or body")
      return NextResponse.json({ ok: false })
    }

    // ✅ Verify and parse webhook
    const event = await paddle.webhooks.unmarshal(rawBody, secretKey, signature)
    const { eventType, data } = event

    // 💳 Transaction completed — main event we care about
    if (eventType === EventName.TransactionCompleted) {
      console.log(`✅ Transaction completed: ${data.id}`)
      console.log(`🧾 Raw customData: ${JSON.stringify(data.customData)}`)

      const customData = data.customData as { organizationToken?: string }

      if (!customData?.organizationToken) {
        console.log("❌ Missing organizationToken in customData")
        return NextResponse.json({ ok: true })
      }

      // 🔐 Decode JWT
      let decodedOrg: { userId: string; activeOrgId: string }
      try {
        decodedOrg = jwt.verify(
          customData.organizationToken,
          process.env.SECRET_KEY!
        ) as { userId: string; activeOrgId: string }
        console.log("🔓 Decoded organization token:", decodedOrg)
      } catch (err) {
        console.error("❌ Invalid organization token:", err)
        return NextResponse.json({ ok: true })
      }

      // 🎯 Detect if one-time purchase
      const isOneTime = !data.subscriptionId

      if (isOneTime) {
        console.log("💰 One-time purchase detected")

        const item = data.items?.[0]
        const priceInfo = item?.price
        const priceName = priceInfo?.name || ""
        const priceDesc = priceInfo?.description || ""
        const priceAmount = Number(priceInfo?.unitPrice?.amount || 0)
        const currency = data.currencyCode || "USD"

        // 🧠 Identify plan tier
        let planType: "PRO" | "ULTIMATE" = "PRO"
        let isUpgrade = false

        // ✅ Detect ULTIMATE upgrade from description
        if (
          priceDesc.toUpperCase().includes("ULTIMATE-ONE-TIME-UPGRADE") ||
          priceName.toUpperCase().includes("ULTIMATE-ONE-TIME-UPGRADE")
        ) {
          planType = "ULTIMATE"
          isUpgrade = true
          console.log("🚀 Detected upgrade: PRO → ULTIMATE one-time")
        } else if (
          priceName.toUpperCase().includes("ULTIMATE") ||
          priceDesc.toUpperCase().includes("ULTIMATE") ||
          priceAmount >= 10000
        ) {
          planType = "ULTIMATE"
        } else if (
          priceName.toUpperCase().includes("PRO") ||
          priceDesc.toUpperCase().includes("PRO") ||
          priceAmount >= 8000
        ) {
          planType = "PRO"
        }

        // 🗑️ Remove any active subscription before saving one-time purchase
        await db
          .delete(subscription)
          .where(eq(subscription.userId, decodedOrg.userId))
        console.log(
          `🗑️ Removed active subscription for user ${decodedOrg.userId}`
        )

        // 💾 Insert purchase record
        await db.insert(purchase).values({
          userId: decodedOrg.userId,
          tier: planType,
          price: priceAmount.toString(),
          currency,
        })

        if (isUpgrade) {
          console.log(
            `✅ Recorded ULTIMATE one-time upgrade purchase for user ${decodedOrg.userId}`
          )
        } else {
          console.log(
            `✅ Recorded ${planType} one-time purchase for user ${decodedOrg.userId}`
          )
        }
      }
    }
    // 🟢 Optional: other events for testing
    if (eventType === EventName.SubscriptionUpdated)
      console.log(`🔄 Subscription updated: ${data.id}`)
    if (eventType === EventName.SubscriptionCanceled)
      console.log(`❌ Subscription canceled: ${data.id}`)
    if (eventType === EventName.SubscriptionActivated)
      console.log(`✨ Subscription activated: ${data.id}`)
  } catch (error) {
    console.error("❌ Webhook Error:", error)
  }

  // ✅ Always return 200 so Paddle doesn’t retry
  return NextResponse.json({ ok: true })
}
