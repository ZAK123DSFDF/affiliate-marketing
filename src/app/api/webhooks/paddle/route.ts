import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // 1. Get the EXACT raw body (critical)
    const rawBody = await request.text();

    // 2. Case-insensitive header check
    const signatureHeader =
      request.headers.get("paddle-signature") ||
      request.headers.get("Paddle-Signature");

    if (!signatureHeader) {
      console.error("Missing signature header");
      return NextResponse.json(
        { error: "Missing Paddle-Signature header" },
        { status: 400 },
      );
    }

    // 3. More robust signature parsing
    const signatureParts: Record<string, string> = {};
    signatureHeader.split(";").forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) signatureParts[key.toLowerCase()] = value;
    });

    const timestamp = signatureParts["ts"];
    const receivedSignature = signatureParts["h1"];

    if (!timestamp || !receivedSignature) {
      console.error("Malformed signature:", signatureHeader);
      return NextResponse.json(
        { error: "Invalid signature format" },
        { status: 400 },
      );
    }

    // 4. Use the SECRET key (not public key)
    const secret = process.env.PADDLE_WEBHOOK_PUBLIC_KEY;
    if (!secret) {
      console.error("Webhook secret not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // 5. Verify the timestamp isn't too old
    const eventTime = parseInt(timestamp);
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - eventTime) > 300) {
      // 5 minute window
      console.error("Expired signature", { eventTime, currentTime });
      return NextResponse.json({ error: "Expired signature" }, { status: 401 });
    }

    // 6. Create the signed payload (ensure no whitespace)
    const signedPayload = `${timestamp}:${rawBody}`.trim();

    // 7. Calculate signature with proper encoding
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload, "utf8") // Explicit encoding
      .digest("hex");

    // 8. Secure comparison
    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(computedSignature, "hex"),
      Buffer.from(receivedSignature, "hex"),
    );

    if (!signatureValid) {
      console.error("Signature mismatch", {
        computed: computedSignature,
        received: receivedSignature,
        timestamp,
        rawBodyLength: rawBody.length,
        signedPayloadLength: signedPayload.length,
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Rest of your webhook processing...
    const payload = JSON.parse(rawBody);
    console.log("Valid webhook:", payload.event_type);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 400 });
  }
}
