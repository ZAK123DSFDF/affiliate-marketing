// File: /app/api/track/route.ts (for App Router)
import { db } from "@/db/drizzle"; // your database client setup
import { affiliateClick, affiliateLink } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const refCode = data.ref;
    await db.insert(affiliateClick).values({
      affiliateLinkId: refCode,
      userAgent: data.userAgent || null,
      referrer: data.referrer || null,
      browser: data.browser || null,
      os: data.os || null,
      deviceType: data.deviceType || null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/track error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
