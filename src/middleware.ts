import { NextResponse } from "next/server"

export function middleware() {
  // retrieve the current response

  return NextResponse.next()
}

// ----------------------------------------
// ⛔️ Rewrite logic disabled — breaks CORS
// ----------------------------------------
// function handleRewriteLogic(request: NextRequest): NextResponse {
//   const host = request.headers.get("host");
//   if (!host) return NextResponse.next();

//   // Handle Vercel deployment URLs
//   if (host.endsWith(".vercel.app")) {
//     const [subdomain] = host.split(".");
//     const affiliateId = subdomain.replace(/^[^-]+-/, "");
//     if (affiliateId) {
//       return NextResponse.rewrite(
//         new URL(`/affiliate/${affiliateId}`, request.url),
//       );
//     }
//   }

//   // Handle custom domains
//   const [subdomain, ...domainParts] = host.replace(/:\d+$/, "").split(".");
//   if (domainParts.length >= 2 && subdomain) {
//     return NextResponse.rewrite(
//       new URL(`/affiliate/${subdomain}`, request.url),
//     );
//   }

//   return NextResponse.next();
// }
