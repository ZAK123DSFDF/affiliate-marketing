import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/db/drizzle"
import { affiliateInvoice, subscriptionExpiration } from "@/db/schema"
import { eq } from "drizzle-orm"
import { calculateTrialDays } from "@/util/CalculateTrialDays"
import { convertToUSD } from "@/util/CurrencyConvert"
import { getCurrencyDecimals } from "@/util/CurrencyDecimal"
import { safeFormatAmount } from "@/util/SafeParse"
import { addDays } from "date-fns"
import { calculateExpirationDate } from "@/util/CalculateExpiration"
import { getAffiliateLinkRecord } from "@/services/getAffiliateLinkRecord"
import { getOrganizationById } from "@/services/getOrganizationById"
import { getSubscriptionExpiration } from "@/services/getSubscriptionExpiration"

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text (important for signature verification)
    const rawBody = await request.text()
    const signatureHeader = request.headers.get("paddle-signature")

    if (!signatureHeader) {
      return NextResponse.json(
        { error: "Missing Paddle-Signature header" },
        { status: 400 }
      )
    }

    const [tsPart, h1Part] = signatureHeader.split(";")
    const timestamp = tsPart.split("=")[1]
    const receivedSignature = h1Part.split("=")[1]

    const secret = process.env.PADDLE_WEBHOOK_PUBLIC_KEY
    if (!secret) {
      return NextResponse.json(
        { error: "Missing webhook secret" },
        { status: 500 }
      )
    }
    const signedPayload = `${timestamp}:${rawBody}`
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex")
    if (computedSignature !== receivedSignature) {
      console.error("Invalid signature", {
        computed: computedSignature,
        received: receivedSignature,
        payload: signedPayload,
      })
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
    const payload = JSON.parse(rawBody)
    switch (payload.event_type) {
      case "transaction.completed": {
        const tx = payload.data
        const isSubscription = Boolean(tx.subscription_id)

        const customerId = tx.customer_id
        const subscriptionId = tx.subscription_id || null
        const rawCurrency = tx.details?.totals?.currency_code || "USD"
        const rawAmount = safeFormatAmount(tx.details?.totals?.total)
        const decimals = getCurrencyDecimals(rawCurrency)
        const { amount } = await convertToUSD(
          parseFloat(rawAmount),
          rawCurrency,
          decimals
        )

        const customData = tx.custom_data || {}
        const refDataRaw = customData.refearnapp_affiliate_code
        if (!refDataRaw) break

        const { code, commissionType, commissionValue } = JSON.parse(refDataRaw)

        const transactionTime = new Date(tx.created_at)

        let commission = 0
        if (commissionType === "percentage") {
          commission = (parseFloat(amount) * parseFloat(commissionValue)) / 100
        } else if (commissionType === "fixed") {
          commission = parseFloat(amount) < 0 ? 0 : parseFloat(commissionValue)
        }

        const affiliateLinkRecord = await getAffiliateLinkRecord(code)
        if (!affiliateLinkRecord) break
        const organizationRecord = await getOrganizationById(
          affiliateLinkRecord.organizationId
        )
        if (!organizationRecord) break
        if (isSubscription) {
          const subscriptionExpirationRecord =
            await getSubscriptionExpiration(subscriptionId)
          const existingInvoice = await db.query.affiliateInvoice.findFirst({
            where: eq(affiliateInvoice.subscriptionId, subscriptionId),
          })

          const reason = existingInvoice
            ? "subscription_update"
            : "subscription_create"
          if (!subscriptionExpirationRecord) {
            const expirationDate = calculateExpirationDate(
              new Date(),
              organizationRecord.commissionDurationValue,
              organizationRecord.commissionDurationUnit
            )

            await db.insert(subscriptionExpiration).values({
              subscriptionId,
              expirationDate,
            })

            console.log("✅ Created new subscription expiration record:", {
              subscriptionId,
              expirationDate: expirationDate.toISOString(),
            })
          } else if (
            transactionTime > subscriptionExpirationRecord.expirationDate
          ) {
            console.log("🚫 Skipping: transaction after expiration date")
            break
          }
          await db.insert(affiliateInvoice).values({
            paymentProvider: "paddle",
            subscriptionId,
            customerId,
            amount: amount.toString(),
            currency: "USD",
            commission: commission.toString(),
            paidAmount: "0.00",
            rawCurrency,
            rawAmount,
            unpaidAmount: commission.toFixed(2),
            affiliateLinkId: affiliateLinkRecord.id,
            reason,
          })
          console.log("✅ Inserted new affiliatePayment:", subscriptionId)
        } else {
          // One-time purchase
          await db.insert(affiliateInvoice).values({
            paymentProvider: "paddle",
            subscriptionId: null,
            customerId,
            amount: amount.toString(),
            currency: "USD",
            commission: commission.toString(),
            paidAmount: "0.00",
            unpaidAmount: commission.toFixed(2),
            affiliateLinkId: affiliateLinkRecord.id,
            reason: "one_time",
          })

          console.log("✅ Inserted one-time affiliatePayment:", customerId)
        }

        console.log("✅ Logged checkTransaction:", subscriptionId ?? customerId)
        break
      }

      case "subscription.created": {
        const sub = payload.data
        const isTrial = sub.status === "trialing"
        if (!isTrial) {
          console.log(
            "Subscription created but not trialing — skipping expiration update"
          )
          break
        }
        const subscriptionId = sub.id
        const customData = sub.custom_data || {}
        const refDataRaw = customData.refearnapp_affiliate_code
        if (!refDataRaw) break

        const { code } = JSON.parse(refDataRaw)
        const affiliateLinkRecord = await getAffiliateLinkRecord(code)
        if (!affiliateLinkRecord) break
        const organizationRecord = await getOrganizationById(
          affiliateLinkRecord.organizationId
        )
        if (!organizationRecord) break

        const existingExpiration =
          await getSubscriptionExpiration(subscriptionId)
        let expirationDate: Date
        if (existingExpiration) {
          const trialPeriod = sub.items?.[0]?.price?.trial_period
          const interval = trialPeriod?.interval
          const frequency = Number(trialPeriod?.frequency || 0)
          const trialDays = calculateTrialDays(interval, frequency)

          expirationDate = addDays(new Date(), trialDays)

          await db
            .update(subscriptionExpiration)
            .set({ expirationDate })
            .where(eq(subscriptionExpiration.subscriptionId, subscriptionId))
        } else {
          expirationDate = calculateExpirationDate(
            new Date(),
            organizationRecord.commissionDurationValue,
            organizationRecord.commissionDurationUnit
          )

          await db.insert(subscriptionExpiration).values({
            subscriptionId,
            expirationDate,
          })
        }

        console.log("✅ Updated subscription expiration for:", {
          subscriptionId,
          expirationDate: expirationDate.toISOString(),
        })
        break
      }

      default:
        console.log("Unhandled event type:", payload.event_type)
    }

    return NextResponse.json({ received: true, payload }, { status: 200 })
  } catch (err) {
    console.error("Error processing Paddle webhook:", err)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    )
  }
}
