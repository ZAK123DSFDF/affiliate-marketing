// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db/drizzle";
import { checkTransaction } from "@/db/schema";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { generateStripeCustomerId } from "@/util/StripeCustomerId";
import { convertToUSD } from "@/util/CurrencyConvert";
import { getCurrencyDecimals } from "@/util/CurrencyDecimal";
import { safeFormatAmount } from "@/util/SafeParse";
import { invoicePaidUpdate } from "@/util/InvoicePaidUpdate";
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
      const rawAmount = safeFormatAmount(session.amount_total);
      const decimals = getCurrencyDecimals(session.currency ?? "usd");
      const { amount, currency } = await convertToUSD(
        parseFloat(rawAmount),
        session.currency ?? "usd",
        decimals,
      );
      const expirationDate = addDays(new Date(), 7);

      if (subscriptionId) {
        const existing = await db.query.checkTransaction.findFirst({
          where: (tx, { eq }) => eq(tx.subscriptionId, subscriptionId),
        });

        if (existing) {
          await db
            .update(checkTransaction)
            .set({
              customData: metadata,
            })
            .where(eq(checkTransaction.subscriptionId, subscriptionId));

          console.log(
            "✅ checkout.session.completed — updated customData for existing subscription:",
            subscriptionId,
          );
        } else {
          await db.insert(checkTransaction).values({
            customerId,
            subscriptionId,
            amount,
            currency,
            expirationDate,
            customData: metadata,
          });

          console.log(
            "✅ checkout.session.completed — inserted new subscription:",
            subscriptionId,
          );
        }
      } else {
        await db.insert(checkTransaction).values({
          customerId,
          subscriptionId: null,
          amount,
          currency,
          expirationDate,
          customData: metadata,
        });

        console.log(
          "✅ checkout.session.completed — inserted one-time payment:",
          customerId,
        );
      }

      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const metadata = subscription.metadata || {};
      console.log("✅ Subscription created:", subscription.id);

      if (
        subscription.status === "trialing" &&
        subscription.trial_end !== null &&
        subscription.trial_start !== null
      ) {
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;
        const amount = "0.00";
        const currency = "usd".toUpperCase();
        const trialDurationMs =
          (subscription.trial_end - subscription.trial_start) * 1000;
        const trialDaysOnly = Math.round(
          trialDurationMs / (1000 * 60 * 60 * 24),
        );
        const defaultExpiration = addDays(new Date(), 7);
        const finalExpiration = new Date(
          defaultExpiration.getTime() + trialDurationMs,
        );

        console.log(`Calculated trial duration: ${trialDurationMs / 1000}s`);
        console.log(`Final expiration: ${finalExpiration}`);

        const existing = await db.query.checkTransaction.findFirst({
          where: (tx, { eq }) => eq(tx.subscriptionId, subscriptionId),
        });

        if (existing) {
          const newExpiration = addDays(
            new Date(existing.expirationDate),
            trialDaysOnly,
          );
          await db
            .update(checkTransaction)
            .set({
              expirationDate: newExpiration,
            })
            .where(eq(checkTransaction.subscriptionId, subscriptionId));

          console.log(
            "✅ Updated existing subscription expirationDate:",
            subscriptionId,
          );
        } else {
          await db.insert(checkTransaction).values({
            customerId,
            subscriptionId,
            amount,
            currency,
            expirationDate: finalExpiration,
            customData: metadata,
          });

          console.log(
            "✅ Inserted new subscription with trial expirationDate:",
            subscriptionId,
          );
        }
      } else {
        console.log(
          `Subscription status is '${subscription.status}' — skipping`,
        );
      }

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceCreatedDate = new Date(invoice.created * 1000);
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

        if (existing.expirationDate > invoiceCreatedDate) {
          await invoicePaidUpdate(
            String(invoice.total_excluding_tax ?? 0),
            invoice.currency,
            existing.amount,
            subscriptionId,
          );

          console.log(
            "✅ Updated subscription amount for upgrade:",
            subscriptionId,
          );
        } else {
          console.warn(
            "❌ Subscription is expired — ignoring update:",
            subscriptionId,
          );
        }
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
        const invoiceCreatedDate = new Date(invoice.created * 1000);
        if (existing.expirationDate > invoiceCreatedDate) {
          await invoicePaidUpdate(
            String(invoice.total_excluding_tax ?? 0),
            invoice.currency,
            existing.amount,
            subscriptionId,
          );

          console.log(
            "✅ Updated subscription amount for new cycle:",
            subscriptionId,
          );
        } else {
          console.warn(
            "❌ Subscription is expired — ignoring update:",
            subscriptionId,
          );
        }
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
