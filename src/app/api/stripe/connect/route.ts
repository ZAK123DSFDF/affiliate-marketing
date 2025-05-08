// app/api/stripe/connect/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const client_id = process.env.STRIPE_CLIENT_ID!;
  const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/oauth/callback`;

  const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${client_id}&scope=read_write&redirect_uri=${encodeURIComponent(redirect_uri)}`;

  return NextResponse.redirect(stripeUrl);
}
