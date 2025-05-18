import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("Paddle-Signature");

    if (!signatureHeader) {
      return NextResponse.json(
        { error: "Missing Paddle-Signature header" },
        { status: 400 },
      );
    }

    const [tsPart, h1Part] = signatureHeader.split(";");
    const timestamp = tsPart.split("=")[1];
    const receivedSignature = h1Part.split("=")[1];

    const secret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing webhook secret" },
        { status: 500 },
      );
    }

    const payload = `${timestamp}:${rawBody}`;
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (computedSignature !== receivedSignature) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payloadJson = JSON.parse(rawBody);
    const eventType = payloadJson.event_type;

    switch (eventType) {
      case "subscription.created":
        await db.insert(users).values({
          email: "zaksubscription@gmail.com",
          name: "zak",
          age: 28,
        });
        console.log("New subscription:", payloadJson.data.id);
        break;
      case "transaction.completed":
        await db.insert(users).values({
          email: "zaktransaction@gmail.com",
          name: "zak",
          age: 28,
        });
        console.log("Payment completed:", payloadJson.data.id);
        break;
      default:
        console.log("Unhandled event type:", eventType);
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
