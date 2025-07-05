// File: /app/api/org/route.ts
import { db } from "@/db/drizzle";
import { affiliateLink, organization } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing referral code" },
      { status: 400 },
    );
  }

  const [result] = await db
    .select({
      organizationId: affiliateLink.organizationId,
      cookieLifetimeValue: organization.cookieLifetimeValue,
      cookieLifetimeUnit: organization.cookieLifetimeUnit,
      commissionType: organization.commissionType,
      commissionValue: organization.commissionValue,
      commissionDurationValue: organization.commissionDurationValue,
      commissionDurationUnit: organization.commissionDurationUnit,
    })
    .from(affiliateLink)
    .innerJoin(organization, eq(affiliateLink.organizationId, organization.id))
    .where(eq(affiliateLink.id, code))
    .limit(1);

  if (!result) {
    return NextResponse.json(
      { error: "Affiliate link or organization not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
