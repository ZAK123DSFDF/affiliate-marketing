// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db/drizzle";
import { checkTransaction } from "@/db/schema";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { generateStripeCustomerId } from "@/util/StripeCustomerId";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log("incoming webhook request");
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      const mode = session.mode;
      const isSubscription = mode === "subscription";
      const customerId = session.customer
        ? (session.customer as string)
        : generateStripeCustomerId();
      const subscriptionId = isSubscription
        ? (session.subscription as string)
        : null;
      const amount = session.amount_total ?? 0;
      const currency = session.currency ?? "usd";
      const expirationDate = addDays(new Date(), 7);
      const paymentIntent = session.payment_intent;
      await db.insert(checkTransaction).values({
        customerId,
        subscriptionId,
        amount,
        currency,
        expirationDate,
        customData: metadata,
      });

      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const metadata = subscription.metadata || {};
      console.log("✅ Subscription created:", subscription.id);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.billing_reason === "subscription_update") {
        const subscriptionId =
          invoice.parent?.subscription_details?.subscription;

        if (!subscriptionId || typeof subscriptionId !== "string") {
          console.warn(
            "❌ No valid subscriptionId found in invoice.parent for update.",
          );
          return;
        }

        const existing = await db.query.checkTransaction.findFirst({
          where: (tx, { eq }) => eq(tx.subscriptionId, subscriptionId),
        });

        if (!existing) {
          console.warn(
            "❌ No existing subscription found for update:",
            subscriptionId,
          );
          return;
        }

        const taxExcludedAmount = invoice.total_excluding_tax ?? 0;

        await db
          .update(checkTransaction)
          .set({
            amount: existing.amount + taxExcludedAmount,
          })
          .where(eq(checkTransaction.subscriptionId, subscriptionId));

        console.log(
          "✅ Updated subscription amount for upgrade:",
          subscriptionId,
        );
      }

      if (invoice.billing_reason === "subscription_cycle") {
        const subscriptionId =
          invoice.parent?.subscription_details?.subscription;

        if (!subscriptionId || typeof subscriptionId !== "string") {
          console.warn(
            "❌ No valid subscriptionId found in invoice.parent for cycle.",
          );
          return;
        }

        const existing = await db.query.checkTransaction.findFirst({
          where: (tx, { eq }) => eq(tx.subscriptionId, subscriptionId),
        });

        if (!existing) {
          console.warn(
            "❌ No existing subscription found for cycle:",
            subscriptionId,
          );
          return;
        }

        const taxExcludedAmount = invoice.total_excluding_tax ?? 0;

        await db
          .update(checkTransaction)
          .set({
            amount: existing.amount + taxExcludedAmount,
          })
          .where(eq(checkTransaction.subscriptionId, subscriptionId));

        console.log(
          "✅ Updated subscription amount for new cycle:",
          subscriptionId,
        );
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
