// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db/drizzle";
import {
  affiliateLink,
  affiliatePayment,
  checkTransaction,
  organization,
} from "@/db/schema";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import { eq } from "drizzle-orm";
import { generateStripeCustomerId } from "@/util/StripeCustomerId";
import { convertToUSD } from "@/util/CurrencyConvert";
import { getCurrencyDecimals } from "@/util/CurrencyDecimal";
import { safeFormatAmount } from "@/util/SafeParse";
import { invoicePaidUpdate } from "@/util/InvoicePaidUpdate";
import { calculateExpirationDate } from "@/util/CalculateExpiration";
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
      const refDataRaw = metadata.refearnapp_affiliate_code;
      if (!refDataRaw) break;
      const {
        code,
        commissionType,
        commissionValue,
        commissionDurationValue,
        commissionDurationUnit,
      } = JSON.parse(refDataRaw);
      const affiliateLinkRecord = await db.query.affiliateLink.findFirst({
        where: (link, { eq }) => eq(link.id, code),
      });

      if (!affiliateLinkRecord) {
        console.warn("❌ Affiliate link not found for code:", code);
        break;
      }
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
      // Calculate expiration
      const now = new Date();
      const expirationDate = calculateExpirationDate(
        now,
        commissionDurationValue,
        commissionDurationUnit,
      );
      // Calculate commission
      let commission = 0;
      if (commissionType === "percentage") {
        commission = (parseFloat(amount) * parseFloat(commissionValue)) / 100
        ;
      } else if (commissionType === "fixed") {
        commission = parseFloat(commissionValue)
      }
      if (subscriptionId) {
        await db.insert(affiliatePayment).values({
          paymentProvider: "stripe",
          subscriptionId,
          customerId,
          amount: amount.toString(),
          currency,
          commission: commission.toString(),
          expirationDate,
          affiliateLinkId: affiliateLinkRecord.id,
        });

        console.log(
          "✅ checkout.session.completed — inserted new subscription:",
          subscriptionId,
        );
      } else {
        await db.insert(affiliatePayment).values({
          paymentProvider: "stripe",
          subscriptionId: null,
          customerId,
          amount: amount.toString(),
          currency,
          commission: commission.toString(),
          expirationDate,
          affiliateLinkId: affiliateLinkRecord.id,
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
      const subscriptionId = subscription.id;

      console.log("✅ Subscription created:", subscriptionId);



      if (
          subscription.status === "trialing" &&
          subscription.trial_end !== null &&
          subscription.trial_start !== null
      ) {
        const trialDurationMs =
            (subscription.trial_end - subscription.trial_start) * 1000;
        const trialDaysOnly = Math.round(trialDurationMs / (1000 * 60 * 60 * 24));
        const tryGetAffiliatePayment = async (retries: number): Promise<any> => {
          for (let i = 0; i <= retries; i++) {
            const existing = await db.query.affiliatePayment.findFirst({
              where: (tx, { eq }) => eq(tx.subscriptionId, subscriptionId),
            });
            if (existing) return existing;
            if (i < retries) await new Promise((res) => setTimeout(res, 2000));
          }
          return null;
        };

        const existingPayment = await tryGetAffiliatePayment(4);
        if (!existingPayment) {
          console.warn("❌ No affiliate payment found after retries:", subscriptionId);
          break;
        }
        const updatedExpiration = addDays(
            existingPayment.expirationDate,
            trialDaysOnly,
        );

        await db
            .update(affiliatePayment)
            .set({ expirationDate: updatedExpiration })
            .where(eq(affiliatePayment.subscriptionId, subscriptionId));

        console.log(
            "✅ Updated affiliate payment with trial days:",
            subscriptionId,
        );
      } else {
        console.log(`Subscription status is '${subscription.status}' — skipping`);
      }

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceCreatedDate = new Date(invoice.created * 1000);
      const subscriptionId = invoice.parent?.subscription_details?.subscription;

      if (!subscriptionId || typeof subscriptionId !== "string") {
        console.warn("❌ No valid subscriptionId found.");
        return;
      }
      const reason = invoice.billing_reason;
      if (reason === "subscription_update" || reason === "subscription_cycle") {
        const affiliateRow = await db
          .select({
            payment: affiliatePayment,
            link: affiliateLink,
            org: organization,
          })
          .from(affiliatePayment)
          .innerJoin(
            affiliateLink,
            eq(affiliatePayment.affiliateLinkId, affiliateLink.id),
          )
          .innerJoin(
            organization,
            eq(affiliateLink.organizationId, organization.id),
          )
          .where(eq(affiliatePayment.subscriptionId, subscriptionId))
          .limit(1)
          .then((rows) => rows[0]);

        if (!affiliateRow) {
          console.warn("❌ No affiliatePayment found:", subscriptionId);
          return;
        }

        const { payment, org } = affiliateRow;
        if (payment.expirationDate <= invoiceCreatedDate) {
          console.warn(
            "❌ Subscription expired — skipping update:",
            subscriptionId,
          );
          return;
        }
        const total = String(invoice.total_excluding_tax ?? 0);
        const currency = invoice.currency;
        const commissionType = org.commissionType ?? "percentage";
        const commissionValue = org.commissionValue ?? "0.00";
        await invoicePaidUpdate(
          total,
          currency,
          payment.amount,
          payment.commission,
          subscriptionId,
          payment.affiliateLinkId,
          commissionType,
          commissionValue,
        );

        console.log(
          `✅ Updated subscription (${reason}) — amount & commission:`,
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
