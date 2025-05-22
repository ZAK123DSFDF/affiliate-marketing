import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST endpoint (for actual webhook events)
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const signature = request.headers.get("Paddle-Signature");

    // 1. Verify the signature (Paddle uses public-key crypto)
    const publicKey = process.env.PADDLE_WEBHOOK_PUBLIC_KEY;

    // Type guard for environment variable and signature
    if (!publicKey || !signature) {
      return NextResponse.json(
        { error: "Missing webhook configuration" },
        { status: 400 },
      );
    }

    // Convert string public key to proper format
    const formattedPublicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey.replace(
      /-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n/g,
      "",
    )}\n-----END PUBLIC KEY-----`;

    const verifier = crypto.createVerify("sha1");
    verifier.update(JSON.stringify(payload));
    const isValid = verifier.verify(
      {
        key: formattedPublicKey,
        format: "pem",
        type: "pkcs1",
      },
      signature,
      "base64",
    );

    if (!isValid) {
      console.error("⚠️ Invalid Paddle signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Process the event (payload is now trusted)
    console.log("🔔 Paddle event:", payload.event_type);

    // 3. Handle specific events
    switch (payload.event_type) {
      case "subscription.created":
        console.log("New subscription:", payload.data.id);
        break;
      case "transaction.completed":
        console.log("Payment completed:", payload.data.id);
        break;
      default:
        console.log("Unhandled event type:", payload.event_type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Error processing Paddle webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
