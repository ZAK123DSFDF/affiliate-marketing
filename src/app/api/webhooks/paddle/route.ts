import { Environment, EventName } from "@paddle/paddle-node-sdk";
import { Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN!, {
  environment: Environment.sandbox,
});

export async function POST(req: Request) {
  const signature = (req.headers.get("paddle-signature") as string) || "";
  const rawRequestBody = (await req.text()) || "";
  const secretKey = process.env.PADDLE_WEBHOOK_PUBLIC_KEY || "";

  try {
    if (signature && rawRequestBody) {
      const eventData = await paddle.webhooks.unmarshal(
        rawRequestBody,
        secretKey,
        signature,
      );

      switch (eventData.eventType) {
        case EventName.SubscriptionActivated:
          console.log(`Subscription ${eventData.data.id} was activated`);
          return NextResponse.json({
            status: "success",
            event: "SubscriptionActivated",
            data: eventData.data,
          });

        case EventName.SubscriptionCanceled:
          console.log(`Subscription ${eventData.data.id} was canceled`);
          return NextResponse.json({
            status: "success",
            event: "SubscriptionCanceled",
            data: eventData.data,
          });

        case EventName.TransactionPaid:
          // await prisma.user.create({
          //   data: {
          //     email: "zaksubscription@gmail.com",
          //     name: "zak",
          //     age: 28,
          //     paymentProvider: "paddle",
          //   },
          // });
          console.log(`Transaction ${eventData.data.id} was paid`);
          return NextResponse.json({
            status: "success",
            event: "TransactionPaid",
            data: eventData,
          });

        default:
          console.log(eventData.eventType);
          return NextResponse.json({
            status: "success",
            event: eventData.eventType,
            data: eventData.data,
          });
      }
    } else {
      console.log("Signature missing in header");
      return NextResponse.json(
        { error: "Signature missing in header" },
        { status: 400 },
      );
    }
  } catch (e) {
    console.error("Webhook processing error:", e);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: 400 },
    );
  }
}
