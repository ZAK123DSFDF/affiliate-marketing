// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow all other requests to proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path(\\d+)", // Numeric paths
    "/((?!_next/static|_next/image|favicon.ico).*)", // All except static files
  ],
};
