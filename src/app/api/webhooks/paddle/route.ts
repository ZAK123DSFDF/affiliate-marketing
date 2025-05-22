import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text (must be raw, unprocessed body)
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("paddle-signature");

    // Debugging logs (remove in production)
    console.log("Raw body received:", rawBody);
    console.log("Signature header:", signatureHeader);

    if (!signatureHeader) {
      console.error("Missing signature header");
      return NextResponse.json(
        { error: "Missing Paddle-Signature header" },
        { status: 400 },
      );
    }

    // Parse signature (more robust parsing)
    const signatureParts = signatureHeader.split(";").reduce(
      (acc, part) => {
        const [key, value] = part.split("=");
        return { ...acc, [key]: value };
      },
      {} as Record<string, string>,
    );

    const timestamp = signatureParts.ts;
    const receivedSignature = signatureParts.h1;

    if (!timestamp || !receivedSignature) {
      console.error("Malformed signature header:", signatureHeader);
      return NextResponse.json(
        { error: "Invalid signature format" },
        { status: 400 },
      );
    }

    const secret = process.env.PADDLE_WEBHOOK_SECRET_KEY; // Note: Should be SECRET not PUBLIC
    if (!secret) {
      console.error("Webhook secret not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Create signed payload
    const signedPayload = `${timestamp}:${rawBody}`;
    console.log("Signed payload:", signedPayload);

    // Calculate expected signature
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    console.log("Computed signature:", computedSignature);
    console.log("Received signature:", receivedSignature);

    // Verify signature (constant-time comparison)
    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(computedSignature),
      Buffer.from(receivedSignature),
    );

    if (!signatureValid) {
      console.error("Signature verification failed", {
        computedLength: computedSignature.length,
        receivedLength: receivedSignature.length,
        rawBodyLength: rawBody.length,
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse and process payload
    const payload = JSON.parse(rawBody);
    console.log("Webhook payload:", JSON.stringify(payload, null, 2));

    // Process events
    switch (payload.event_type) {
      case "subscription.created":
      case "transaction.completed":
        console.log(`Event ${payload.event_type}`, payload.data.id);
        break;
      default:
        console.log("Unhandled event type:", payload.event_type);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
