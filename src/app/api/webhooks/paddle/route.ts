import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db/drizzle";
import { affiliatePayment, checkTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";
import { calculateTrialDays } from "@/util/CalculateTrialDays";
import { convertToUSD } from "@/util/CurrencyConvert";
import { getCurrencyDecimals } from "@/util/CurrencyDecimal";
import { safeFormatAmount } from "@/util/SafeParse";
import { calculateExpirationDate } from "@/util/CalculateExpiration";
import { addDays } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text (important for signature verification)
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("paddle-signature");

    if (!signatureHeader) {
      return NextResponse.json(
        { error: "Missing Paddle-Signature header" },
        { status: 400 },
      );
    }

    // Parse the signature header (format: "ts=123456789;h1=abcdef123456")
    const [tsPart, h1Part] = signatureHeader.split(";");
    const timestamp = tsPart.split("=")[1];
    const receivedSignature = h1Part.split("=")[1];

    const secret = process.env.PADDLE_WEBHOOK_PUBLIC_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing webhook secret" },
        { status: 500 },
      );
    }

    // Create the signed payload
    const signedPayload = `${timestamp}:${rawBody}`;

    // Calculate the expected signature
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    // Verify the signature
    if (computedSignature !== receivedSignature) {
      console.error("Invalid signature", {
        computed: computedSignature,
        received: receivedSignature,
        payload: signedPayload,
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the JSON body only after verification
    const payload = JSON.parse(rawBody);

    // Process the event
    switch (payload.event_type) {
      case "transaction.completed": {
        const tx = payload.data;
        const isSubscription = Boolean(tx.subscription_id);

        const customerId = tx.customer_id;
        const subscriptionId = tx.subscription_id || null;
        const rawCurrency = tx.details?.totals?.currency_code || "USD";
        const rawAmount = safeFormatAmount(tx.details?.totals?.total);
        const decimals = getCurrencyDecimals(rawCurrency);
        const { amount, currency } = await convertToUSD(
          parseFloat(rawAmount),
          rawCurrency,
          decimals,
        );

        const customData = tx.custom_data || {};
        const refDataRaw = customData.refearnapp_affiliate_code;
        if (!refDataRaw) break;

        const {
          code,
          commissionType,
          commissionValue,
          commissionDurationValue,
          commissionDurationUnit,
        } = JSON.parse(refDataRaw);

        const transactionTime = new Date(tx.created_at);
        const now = new Date();
        const expirationDate = calculateExpirationDate(
          now,
          commissionDurationValue,
          commissionDurationUnit,
        );

        let commission = 0;
        if (commissionType === "percentage") {
          commission =
            Math.round(parseFloat(amount) * parseFloat(commissionValue) * 100) /
            100;
        } else if (commissionType === "fixed") {
          commission =
            parseFloat(amount) < 0
              ? -parseFloat(commissionValue)
              : parseFloat(commissionValue);
        }

        const affiliateLinkRecord = await db.query.affiliateLink.findFirst({
          where: (l, { eq }) => eq(l.id, code),
        });

        if (!affiliateLinkRecord) {
          console.warn("❌ Affiliate link not found for code:", code);
          break;
        }

        if (isSubscription) {
          const existing = await db.query.affiliatePayment.findFirst({
            where: (t, { eq }) => eq(t.subscriptionId, subscriptionId),
          });

          if (existing) {
            if (transactionTime > new Date(existing.expirationDate)) {
              console.log("🚫 Skipping: transaction after expiration date");
              break;
            }

            const newAmount = Math.max(
              0,
              parseFloat(existing.amount) + parseFloat(amount),
            ).toFixed(2);

            const newCommission = Math.max(
              0,
              parseFloat(existing.commission) + parseFloat(String(commission)),
            ).toFixed(2);

            await db
              .update(affiliatePayment)
              .set({
                amount: newAmount,
                commission: newCommission,
              })
              .where(eq(affiliatePayment.subscriptionId, subscriptionId));

            console.log(
              "✅ Updated existing affiliatePayment:",
              subscriptionId,
            );
          } else {
            await db.insert(affiliatePayment).values({
              paymentProvider: "paddle",
              customerId,
              subscriptionId,
              amount: amount.toString(),
              currency,
              commission: commission.toString(),
              expirationDate,
              affiliateLinkId: affiliateLinkRecord.id,
            });

            console.log("✅ Inserted new affiliatePayment:", subscriptionId);
          }
        } else {
          // One-time purchase
          await db.insert(affiliatePayment).values({
            paymentProvider: "paddle",
            customerId,
            subscriptionId: null,
            amount: amount.toString(),
            currency,
            commission: commission.toString(),
            expirationDate,
            affiliateLinkId: affiliateLinkRecord.id,
          });

          console.log("✅ Inserted one-time affiliatePayment:", customerId);
        }

        console.log(
          "✅ Logged checkTransaction:",
          subscriptionId ?? customerId,
        );
        break;
      }

      case "subscription.created": {
        const sub = payload.data;
        const isTrial = sub.status === "trialing";
        if (!isTrial) {
          console.log(
            "Subscription created but not trialing — skipping expiration update",
          );
          break;
        }
        const subscriptionId = sub.id;
        const customerId = sub.customer_id;
        const customData = sub.custom_data || {};
        const refDataRaw = customData.refearnapp_affiliate_code;
        if (!refDataRaw) break;

        const { code, commissionDurationValue, commissionDurationUnit } =
          JSON.parse(refDataRaw);
        const currency = "USD";
        const affiliateLinkRecord = await db.query.affiliateLink.findFirst({
          where: (link, { eq }) => eq(link.id, code),
        });

        if (!affiliateLinkRecord) {
          console.warn("❌ Affiliate link not found for code:", code);
          break;
        }
        // 🟢 Use trial_period (interval + frequency)
        const trialPeriod = sub.items?.[0]?.price?.trial_period;
        const interval = trialPeriod?.interval;
        const frequency = Number(trialPeriod?.frequency || 0);
        const trialDays = calculateTrialDays(interval, frequency);
        const now = new Date();
        const expirationDate = calculateExpirationDate(
          now,
          commissionDurationValue,
          commissionDurationUnit,
        );

        console.log(
          `Subscription trial → ${interval} x ${frequency} → TrialDays=${trialDays}`,
        );

        const existing = await db.query.affiliatePayment.findFirst({
          where: (t, { eq }) => eq(t.subscriptionId, subscriptionId),
        });

        if (existing) {
          // 👉 If exists → extend from current expiration
          const newExpiration = new Date(existing.expirationDate);
          newExpiration.setDate(newExpiration.getDate() + trialDays);

          console.log(
            "Existing subscription found → extending expiration:",
            newExpiration.toISOString(),
          );

          await db
            .update(affiliatePayment)
            .set({ expirationDate: newExpiration })
            .where(eq(checkTransaction.subscriptionId, subscriptionId));
        } else {
          // 👉 New insert → add trialDays + extraDays
          const expirationWithoutTrial = calculateExpirationDate(
            new Date(),
            commissionDurationValue,
            commissionDurationUnit,
          );
          const finalExpiration = addDays(expirationWithoutTrial, trialDays);

          console.log(
            "New subscription trial → inserting with expiration:",
            expirationDate.toISOString(),
          );

          await db.insert(affiliatePayment).values({
            paymentProvider: "paddle",
            customerId,
            subscriptionId,
            amount: "0.00",
            currency,
            commission: "0.00",
            expirationDate: finalExpiration,
            affiliateLinkId: affiliateLinkRecord.id,
          });
        }

        break;
      }

      default:
        console.log("Unhandled event type:", payload.event_type);
    }

    return NextResponse.json({ received: true, payload }, { status: 200 });
  } catch (err) {
    console.error("Error processing Paddle webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
