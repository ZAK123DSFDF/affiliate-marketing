// app/api/lemon-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db/drizzle";
import { checkTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("X-Signature");
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      console.error("❌ Missing webhook configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const computedSig = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    if (signature !== computedSig) {
      console.error("⚠️ Invalid signature! Potential attack.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventType = event.meta.event_name;
    const attributes = event.data.attributes;
    const customerId = attributes.customer_id;
    const customData = event.meta.custom_data || {};
    const currency = "usd";

    if (eventType === "order_created") {
      const orderId = event.data.id;
      const amount = attributes.total_usd || attributes.total || 0;
      const createdAt = new Date(attributes.created_at);

      const existing = await db.query.checkTransaction.findFirst({
        where: (tx, { eq }) => eq(tx.customerId, customerId),
      });

      if (!existing) {
        await db.insert(checkTransaction).values({
          customerId,
          subscriptionId: null,
          currency,
          amount,
          expirationDate: new Date(
            createdAt.getTime() + 7 * 24 * 60 * 60 * 1000,
          ),
          customData,
        });
        console.log("✅ Order inserted with customer only");
      } else {
        console.log("ℹ️ Existing customer found. No insert on order_created.");
      }
    }

    if (eventType === "subscription_created") {
      const subscriptionId = event.data.id;
      const renewsAt = new Date(attributes.renews_at);

      const existing = await db.query.checkTransaction.findFirst({
        where: (tx, { eq }) => eq(tx.customerId, customerId),
      });

      if (existing && !existing.subscriptionId) {
        await db
          .update(checkTransaction)
          .set({ subscriptionId, expirationDate: renewsAt })
          .where(eq(checkTransaction.customerId, customerId));

        console.log(
          "✅ Updated existing record with subscription ID and expiration",
        );
      } else {
        console.log(
          "ℹ️ Subscription already linked or no base record to attach to.",
        );
      }
    }

    if (eventType === "subscription_payment_success") {
      const subscriptionId = attributes.subscription_id;
      const createdAt = new Date(attributes.created_at); // when the renewal payment happened
      const amountUsd = attributes.total_usd || 0;

      const existing = await db.query.checkTransaction.findFirst({
        where: (tx, { eq }) => eq(tx.subscriptionId, subscriptionId),
      });

      if (!existing) {
        console.warn("⚠️ Subscription not found, skipping update.");
      } else {
        const existingExpiration = new Date(existing.expirationDate);

        // Only update if this is a new billing cycle
        if (createdAt <= existingExpiration) {
          const newAmount = Math.max(
            0,
            parseFloat(existing.amount) + parseFloat(String(amountUsd)),
          ).toFixed(2);

          await db
            .update(checkTransaction)
            .set({ amount: newAmount })
            .where(eq(checkTransaction.subscriptionId, subscriptionId));

          console.log(`✅ Subscription renewed. +$${amountUsd} USD added.`);
        } else {
          console.log("ℹ️ Skipped renewal update — already expired or ahead.");
        }
      }
    }

    return new NextResponse(JSON.stringify({ success: true, event }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
