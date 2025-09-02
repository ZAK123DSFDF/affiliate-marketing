import { db } from "@/db/drizzle"
import { affiliateClick, affiliateLink, organization } from "@/db/schema"
import { NextRequest, NextResponse } from "next/server"
import { shouldTrackTransaction } from "@/lib/server/tracking"
import { eq } from "drizzle-orm"

// CORS headers for all origins
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle POST request with CORS
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const { ref: refCode, host } = data
    const [affiliateLinkRecord] = await db
      .select({
        linkId: affiliateLink.id,
        orgId: affiliateLink.organizationId,
        orgDomain: organization.domainName,
      })
      .from(affiliateLink)
      .innerJoin(
        organization,
        eq(affiliateLink.organizationId, organization.id)
      )
      .where(eq(affiliateLink.id, refCode))
      .limit(1)

    if (!affiliateLinkRecord || affiliateLinkRecord.orgDomain !== host) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid affiliate code for this domain" }),
        { status: 400 }
      )
    }

    const track = await shouldTrackTransaction(
      affiliateLinkRecord.orgId,
      affiliateLinkRecord.linkId
    )

    if (!track) {
      return new NextResponse(
        JSON.stringify({ success: false, reason: "Free plan limit exceeded" }),
        {
          status: 200,
          headers: corsHeaders,
        }
      )
    }
    await db.insert(affiliateClick).values({
      affiliateLinkId: refCode,
      userAgent: data.userAgent || null,
      referrer: data.referrer || null,
      browser: data.browser || null,
      os: data.os || null,
      deviceType: data.deviceType || null,
    })

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (err) {
    console.error("/api/track error:", err)
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: corsHeaders,
      }
    )
  }
}

// Handle preflight request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}
