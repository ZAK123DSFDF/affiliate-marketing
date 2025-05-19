// app/api/webhooks/paddle/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("Paddle-Signature");
    const secret = process.env.PADDLE_WEBHOOK_PUBLIC_KEY; // Not the public key anymore

    if (!secret || !signature) {
      console.error("❌ Missing webhook secret or signature");
      return NextResponse.json(
        { error: "Missing configuration" },
        { status: 500 },
      );
    }

    // HMAC SHA256 verification
    const computedSig = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (signature !== computedSig) {
      console.error("⚠️ Invalid Paddle signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    console.log("🔔 Paddle event:", event.event_type);

    switch (event.event_type) {
      case "subscription_created":
        console.log("✅ New subscription:", event.data.id);
        break;
      case "transaction_completed":
        console.log("💰 Payment completed:", event.data.id);
        break;
      default:
        console.log("Unhandled Paddle event:", event.event_type);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error processing Paddle webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
