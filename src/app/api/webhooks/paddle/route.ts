import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db/drizzle";
import { checkTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";
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
      case "transaction.completed":
        const tx = payload.data;
        const isSubscription = Boolean(tx.subscription_id);

        const customerId = tx.customer_id;
        const subscriptionId = tx.subscription_id || null;
        const currency = tx.details?.totals?.currency_code || "USD";
        const rawAmount = Number(tx.details?.totals?.total || 0);
        const customData = tx.custom_data || {};
        const transactionTime = new Date(tx.created_at); // <-- from Paddle

        // Compute new expiration date
        const expirationDate = new Date();

        expirationDate.setDate(expirationDate.getDate() + 7);

        if (isSubscription) {
          const existing = await db.query.checkTransaction.findFirst({
            where: (t, { eq }) => eq(t.subscriptionId, subscriptionId),
          });

          if (existing) {
            // 🚫 Skip if the transaction is after the expiration
            if (transactionTime > new Date(existing.expirationDate)) {
              console.log("Transaction ignored: after expiration");
              break;
            }
            const newAmount = Math.max(0, existing.amount + rawAmount);
            await db
              .update(checkTransaction)
              .set({ amount: newAmount })
              .where(eq(checkTransaction.subscriptionId, subscriptionId));
          } else {
            const insertData: any = {
              customerId,
              subscriptionId,
              amount: rawAmount,
              currency,
              expirationDate,
              customData,
            };

            await db.insert(checkTransaction).values(insertData);
          }
        } else {
          // One-time purchase: no check needed
          await db.insert(checkTransaction).values({
            customerId,
            subscriptionId: null,
            currency,
            amount: rawAmount,
            expirationDate,
            customData,
          });
        }

        break;
      case "subscription.created": {
        const sub = payload.data;
        const subscriptionId = sub.id;
        const customerId = sub.customer_id;
        const customData = sub.custom_data || {};
        const currency = sub.currency_code || "USD";

        const isTrial = sub.status === "trialing";
        if (!isTrial) {
          console.log(
            "Subscription created but not trialing — skipping expiration update",
          );
          break;
        }

        // 🟢 Use trial_period (interval + frequency)
        const trialPeriod = sub.items?.[0]?.price?.trial_period;
        const interval = trialPeriod?.interval;
        const frequency = Number(trialPeriod?.frequency || 0);

        const expirationDate = new Date();
        const trialDays = calculateTrialDays(interval, frequency);
        expirationDate.setDate(expirationDate.getDate() + trialDays + 7);

        console.log(
          `Subscription trial → ${interval} x ${frequency} → Expiration: ${expirationDate.toISOString()}`,
        );

        const existing = await db.query.checkTransaction.findFirst({
          where: (t, { eq }) => eq(t.subscriptionId, subscriptionId),
        });

        if (existing) {
          console.log("Existing subscription found → updating expiration");
          await db
            .update(checkTransaction)
            .set({ expirationDate })
            .where(eq(checkTransaction.subscriptionId, subscriptionId));
        } else {
          console.log("New subscription trial → inserting record");
          await db.insert(checkTransaction).values({
            customerId,
            subscriptionId,
            currency,
            amount: 0, // no amount yet
            expirationDate,
            customData,
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
