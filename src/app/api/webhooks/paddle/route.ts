import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text (important for signature verification)
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("paddle-signature");

    if (!signatureHeader) {
      return NextResponse.json(
        { error: "Missing Paddle-Signature header" },
        { status: 400 },
      );
    }

    // Parse the signature header (format: "ts=123456789;h1=abcdef123456")
    const [tsPart, h1Part] = signatureHeader.split(";");
    const timestamp = tsPart.split("=")[1];
    const receivedSignature = h1Part.split("=")[1];

    const secret = process.env.PADDLE_WEBHOOK_PUBLIC_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing webhook secret" },
        { status: 500 },
      );
    }

    // Create the signed payload
    const signedPayload = `${timestamp}:${rawBody}`;

    // Calculate the expected signature
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    // Verify the signature
    if (computedSignature !== receivedSignature) {
      console.error("Invalid signature", {
        computed: computedSignature,
        received: receivedSignature,
        payload: signedPayload,
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the JSON body only after verification
    const payload = JSON.parse(rawBody);

    // Process the event
    switch (payload.event_type) {
      case "subscription.created":
        // await prisma.user.create({
        //   data: {
        //     email:
        //       payload.data.custom_data.email || "zaksubscription@gmail.com",
        //     name: payload.data.custom_data.name || "zak",
        //     age: 28,
        //     paymentProvider: "paddle",
        //   },
        // });
        console.log("New subscription:", payload.data.id);
        break;
      case "transaction.completed":
        // await prisma.user.create({
        //   data: {
        //     email:
        //       payload.data.custom_data.email || "zaksubscription@gmail.com",
        //     name: payload.data.custom_data.name || "zak",
        //     age: 28,
        //     paymentProvider: "paddle",
        //   },
        // });
        console.log("Payment completed:", payload.data.id);
        break;
      default:
        console.log("Unhandled event type:", payload.event_type);
    }

    return NextResponse.json({ received: true, payload }, { status: 200 });
  } catch (err) {
    console.error("Error processing Paddle webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
