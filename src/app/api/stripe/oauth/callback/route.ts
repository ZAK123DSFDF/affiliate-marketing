// app/api/stripe/oauth/callback/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No code received from Stripe" },
      { status: 400 },
    );
  }

  try {
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const connectedAccountId = response.stripe_user_id;

    // ✅ Save connectedAccountId in your DB associated with the user
    // For example: await db.users.update({ userId, stripeAccountId: connectedAccountId });

    // ✅ Create webhook on seller's account

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/success?account=${connectedAccountId}`,
    );
  } catch (error: any) {
    console.error("Stripe OAuth Error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/error?message=${encodeURIComponent(error.message)}`,
    );
  }
}
