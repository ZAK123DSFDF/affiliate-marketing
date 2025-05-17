import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

// Create Stripe instance with your **platform** secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Your webhook signing secret

export async function POST(req: NextRequest) {
  console.log("incoming webhook request");
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text(); // Stripe requires raw body for signature verification

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Handle specific event types
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await db.insert(users).values({
        email: "zak@gmail.com",
        name: "zak",
        age: 28,
        paymentProvider: "stripe",
      });

      console.log("✅ PaymentIntent succeeded:", paymentIntent.id);
      // You can store it in DB, notify someone, etc.
      break;
    }

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Checkout session completed:", session.id);
      // Handle post-payment logic (e.g., unlock content, fulfill order)
      await db.insert(users).values({
        email: "zakcheckout@gmail.com",
        name: "zak",
        age: 28,
        paymentProvider: "stripe",
      });
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
