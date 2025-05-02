// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host) return NextResponse.next();

  // Handle Vercel deployment URLs
  if (host.endsWith(".vercel.app")) {
    const [subdomain] = host.split(".");

    // Extract affiliate ID (from "affiliate-marketing-nu" → "marketing-nu")
    const affiliateId = subdomain.replace(/^[^-]+-/, ""); // Remove prefix

    if (affiliateId) {
      return NextResponse.rewrite(
        new URL(`/affiliate/${affiliateId}`, request.url),
      );
    }
  }

  // Handle custom domains (keep your existing logic)
  const [subdomain, ...domainParts] = host.replace(/:\d+$/, "").split(".");
  if (domainParts.length >= 2 && subdomain) {
    return NextResponse.rewrite(
      new URL(`/affiliate/${subdomain}`, request.url),
    );
  }

  return NextResponse.next();
}
