// app/api/stripe/disconnect/route.ts
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(req: Request) {
  try {
    const { stripeAccountId } = await req.json()

    await stripe.oauth.deauthorize({
      client_id: process.env.STRIPE_CLIENT_ID!,
      stripe_user_id: stripeAccountId,
    })

    // Optionally update DB to remove the stored stripeAccountId
    // await db.users.update({ userId, stripeAccountId: null });

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Stripe Disconnect Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
