// File: /app/api/org/route.ts
import { db } from "@/db/drizzle";
import { affiliateLink, organization } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};
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
    return new NextResponse(
      JSON.stringify({ error: "Affiliate link or organization not found" }),
      {
        status: 404,
        headers: corsHeaders,
      },
    );
  }

  return new NextResponse(JSON.stringify(result), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
