// app/api/log-affiliate/route.ts
export const runtime = "edge";

export async function POST(request: Request) {
  const data = await request.json();

  // Log to server (visible in terminal/Vercel logs)
  console.log("Affiliate click detected:", {
    affiliateId: data.affiliateId,
    campaign: data.campaign,
    url: data.url,
    timestamp: new Date(data.timestamp).toISOString(),
  });

  return new Response("Logged successfully", { status: 200 });
}
