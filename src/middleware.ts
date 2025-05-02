// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host");
  const path = request.nextUrl.pathname.split("/")[1];

  // Skip static files and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 1. Handle numeric paths (/1234 → /affiliate)
  if (/^\d+$/.test(path)) {
    url.pathname = "/affiliate";
    return NextResponse.rewrite(url);
  }

  // 2. Handle main domain access (allow normal pages)
  if (host === "affiliate-marketing-seven.vercel.app") {
    return NextResponse.next(); // Don't redirect main domain
  }

  // 3. Handle Vercel preview URLs (affiliate1-projectname.vercel.app)
  if (host?.includes("vercel.app") && host.split(".").length === 3) {
    const subdomain = host.split(".")[0];
    if (subdomain.startsWith("affiliate")) {
      url.pathname = "/affiliate";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path(\\d+)", // Numeric paths
  ],
};
