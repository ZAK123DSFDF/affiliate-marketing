// app/api/log-Affiliates/route.ts
export const runtime = "edge"

export async function POST(request: Request) {
  const data = await request.json()

  console.log("Affiliate tracking:", {
    // Required fields
    affiliateId: data.affiliateId,
    timestamp: new Date(data.timestamp).toISOString(),

    // Optional fields
    campaign: data.campaign || "none",
    source: data.source || "unknown",
    url: data.url || window.location.href,
  })

  return new Response(null, { status: 204 }) // 204 No Content
}
