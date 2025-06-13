// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { affiliateSubscription } from "@/db/schema";
import { db } from "@/db/drizzle";

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

      await db.insert(affiliateSubscription).values({
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        metadata: JSON.stringify(metadata),
      });

      console.log("✅ Checkout session completed:", session.id);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const metadata = subscription.metadata || {};

      await db.insert(affiliateSubscription).values({
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        metadata: JSON.stringify(metadata),
      });

      console.log("✅ Subscription updated:", subscription.id);
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const metadata = subscription.metadata || {};

      await db.insert(affiliateSubscription).values({
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        metadata: JSON.stringify(metadata),
      });

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
