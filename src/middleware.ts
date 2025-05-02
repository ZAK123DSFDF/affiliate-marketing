// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host")?.replace(/:\d+$/, "");
  const path = request.nextUrl.pathname.split("/")[1];

  // Skip API routes and static files
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 1. Handle numeric affiliate IDs (/1234 → /affiliate)
  if (/^\d+$/.test(path)) {
    url.pathname = `/affiliate`;
    return NextResponse.rewrite(url);
  }

  // 2. Handle Vercel deployment subdomains
  if (host) {
    // For Vercel deployments (affiliate1-[project].vercel.app)
    if (host.includes("vercel.app")) {
      const subdomain = host.split(".")[0];
      const affiliateSubdomain = subdomain.split("-")[0]; // affiliate1 from affiliate1-projectname

      if (affiliateSubdomain.startsWith("affiliate")) {
        url.pathname = `/affiliate`;
        return NextResponse.rewrite(url);
      }
    }

    // For custom domains (affiliate1.yourdomain.com)
    const domainParts = host.split(".");
    if (domainParts.length > 2) {
      const subdomain = domainParts[0];
      if (subdomain.startsWith("affiliate")) {
        url.pathname = `/affiliate`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // Allow all other requests to proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path(\\d+)", // Numeric paths
    "/((?!_next/static|_next/image|favicon.ico).*)", // All except static files
  ],
};
