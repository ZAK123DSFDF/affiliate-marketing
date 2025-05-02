// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host) return NextResponse.next();

  // Extract subdomain (works for both 'abc.myapp.test' and 'abc.myapp.test:3000')
  const [subdomain, ...domainParts] = host.replace(/:\d+$/, "").split(".");

  // Rewrite if:
  // 1. There's a subdomain (domainParts.length >= 2)
  // 2. AND it's not the main domain (subdomain !== 'www' etc.)
  if (domainParts.length >= 2 && subdomain) {
    return NextResponse.rewrite(
      new URL(`/affiliate/${subdomain}`, request.url),
    );
  }

  return NextResponse.next();
}
