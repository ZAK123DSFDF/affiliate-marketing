// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run your existing middleware logic
  const response = handleRewriteLogic(request);

  // Apply CORS headers to API routes only
  if (pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  return response;
}

// Your existing logic preserved here
function handleRewriteLogic(request: NextRequest): NextResponse {
  const host = request.headers.get("host");
  if (!host) return NextResponse.next();

  // Handle Vercel deployment URLs
  if (host.endsWith(".vercel.app")) {
    const [subdomain] = host.split(".");
    const affiliateId = subdomain.replace(/^[^-]+-/, "");
    if (affiliateId) {
      return NextResponse.rewrite(
        new URL(`/affiliate/${affiliateId}`, request.url),
      );
    }
  }

  // Handle custom domains
  const [subdomain, ...domainParts] = host.replace(/:\d+$/, "").split(".");
  if (domainParts.length >= 2 && subdomain) {
    return NextResponse.rewrite(
      new URL(`/affiliate/${subdomain}`, request.url),
    );
  }

  return NextResponse.next();
}
