import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { websiteDomain } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function proxy(req: NextRequest) {
  const host = req.headers.get("host")
  if (!host) return NextResponse.next()
  if (
    host.includes("localhost:3000") ||
    host.includes("127.0.0.1:3000") ||
    host === "refearnapp.com" ||
    host === "affiliate-marketing-hazel.vercel.app"
  ) {
    return NextResponse.next()
  }
  const [foundDomain] = await db
    .select({
      id: websiteDomain.id,
      orgId: websiteDomain.orgId,
      domainName: websiteDomain.domainName,
      isActive: websiteDomain.isActive,
      isRedirect: websiteDomain.isRedirect,
    })
    .from(websiteDomain)
    .where(eq(websiteDomain.domainName, host))
    .limit(1)

  if (!foundDomain) {
    return NextResponse.rewrite(new URL("/404", req.url))
  }
  if (foundDomain.isRedirect) {
    const [newDomain] = await db
      .select({ domainName: websiteDomain.domainName })
      .from(websiteDomain)
      .where(
        and(
          eq(websiteDomain.orgId, foundDomain.orgId),
          eq(websiteDomain.isActive, true)
        )
      )
      .limit(1)

    if (newDomain) {
      return NextResponse.redirect(
        new URL(
          req.nextUrl.pathname + req.nextUrl.search,
          `https://${newDomain.domainName}`
        )
      )
    }
  }
  const rewriteUrl = new URL(
    `/affiliate/${foundDomain.orgId}${req.nextUrl.pathname}${req.nextUrl.search}`,
    "http://localhost:3000"
  )

  const response = NextResponse.rewrite(rewriteUrl)
  response.headers.set("x-current-host", host)
  return response
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
