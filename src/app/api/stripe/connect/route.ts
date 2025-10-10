import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { orgId } = await req.json()

  if (!orgId) {
    return NextResponse.json({ error: "Missing orgId" }, { status: 400 })
  }

  const client_id = process.env.STRIPE_CLIENT_ID!
  const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/oauth/callback?orgId=${orgId}`

  const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${client_id}&scope=read_write&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}`

  return NextResponse.json({ url: stripeUrl })
}
