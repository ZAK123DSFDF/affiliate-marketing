import { NextResponse } from "next/server";

export function middleware() {
  // retrieve the current response
  const res = NextResponse.next();

  // add the CORS headers to the response
  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append("Access-Control-Allow-Origin", "*"); // replace this your actual origin
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT",
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  return res;
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: "/api/:path*",
};

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
