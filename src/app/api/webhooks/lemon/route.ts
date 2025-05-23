// app/api/lemon-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("X-Signature");
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    // Validate required values exist
    if (!secret || !signature) {
      console.error("❌ Missing webhook configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // 1. Verify HMAC signature
    const computedSig = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (signature !== computedSig) {
      console.error("⚠️ Invalid signature! Potential attack.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Process the event (payload is now trusted)
    const event = JSON.parse(payload);
    console.log("🔔 Event received:", event.meta.event_name);

    // 3. Handle critical events (example)
    if (event.meta.event_name === "order_created") {
      await prisma.user.create({
        data: {
          email: event.meta.custom_data.email || "zakLemonCheckout@gmail.com",
          name: event.meta.custom_data.name || "zak",
          age: 28,
          paymentProvider: "lemon_squeezy",
        },
      });
    }

    return new NextResponse(JSON.stringify({ success: true, event }, null, 2), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
