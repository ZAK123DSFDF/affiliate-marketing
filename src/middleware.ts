// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host")?.replace(/:\d+$/, ""); // Remove port
  const path = request.nextUrl.pathname.split("/")[1];

  // 1. Handle numeric paths (/1234 → /affiliate)
  if (/^\d+$/.test(path)) {
    url.pathname = `/affiliate`;
    return NextResponse.rewrite(url);
  }

  // 2. Handle subdomains (affiliate1.example.com → /affiliate)
  if (host) {
    // For local development (affiliate1.localhost)
    if (host.startsWith("affiliate") && host.endsWith("localhost")) {
      const subdomain = host.split(".")[0];
      if (!["affiliate1", "affiliate2"].includes(subdomain)) {
        return NextResponse.redirect(
          new URL("/invalid-affiliate", request.url),
        );
      }
      url.pathname = `/affiliate`;
      return NextResponse.rewrite(url);
    }

    // For production/network (affiliate1.yourdomain.com)
    const domainParts = host.split(".");
    if (domainParts.length > 2) {
      // Has subdomain
      const subdomain = domainParts[0];
      if (subdomain.startsWith("affiliate")) {
        url.pathname = `/affiliate`;
        return NextResponse.rewrite(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path(\\d+)", // Numeric paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // All other routes
  ],
};
