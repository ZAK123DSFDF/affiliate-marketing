// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db/drizzle";
import { checkTransaction } from "@/db/schema";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
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
      const customerId = session.customer as string;
      const subscriptionId = isSubscription
        ? (session.subscription as string)
        : null;
      const amount = session.amount_total ?? 0;
      const currency = session.currency ?? "usd";
      const expirationDate = addDays(new Date(), 7);

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

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const previous = (event.data as any).previous_attributes;

      const subscriptionId = subscription.id;
      const customerId = subscription.customer as string;

      const currentItem = subscription.items.data[0];
      const currentPlan = currentItem?.plan;
      const previousItem = previous?.items?.data?.[0];
      const previousPlan = previousItem?.plan;

      const currentEnd = currentItem?.current_period_end;
      const previousEnd = previousItem?.current_period_end;

      if (!currentPlan) return;

      const currency = currentPlan.currency;
      const expirationDate = addDays(new Date(), 7);

      // Ensure subscription exists in your DB (optional if used for deduping)
      const existingSubscription = await db.query.checkTransaction.findFirst({
        where: (sub, { eq }) => eq(sub.subscriptionId, subscriptionId),
      });

      if (!existingSubscription) {
        console.warn(
          "Subscription not found in DB, skipping transaction recording.",
        );
        return;
      }

      // Handle upgrade
      if (previousPlan && currentPlan.id !== previousPlan.id) {
        const amountDiff = currentPlan.amount! - previousPlan.amount!;
        if (amountDiff > 0) {
          await db
            .update(checkTransaction)
            .set({
              amount: existingSubscription.amount + amountDiff,
              currency,
              expirationDate,
            })
            .where(eq(checkTransaction.subscriptionId, subscriptionId));
        }
      }

      // Handle renewal (if period end changed)
      if (
        currentEnd &&
        previousEnd &&
        currentEnd > previousEnd &&
        (!previousPlan || currentPlan.id === previousPlan.id) // Avoid double-charge if upgrade already handled
      ) {
        await db
          .update(checkTransaction)
          .set({
            amount: existingSubscription.amount + currentPlan.amount!,
            currency,
            expirationDate,
          })
          .where(eq(checkTransaction.subscriptionId, subscriptionId));
      }
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const metadata = subscription.metadata || {};
      console.log("✅ Subscription created:", subscription.id);
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("✅ PaymentIntent succeeded:", paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
