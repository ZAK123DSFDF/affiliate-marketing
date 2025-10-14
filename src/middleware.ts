import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/drizzle"

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host")
  if (!host) return NextResponse.next()
  const foundDomain = await db.query.domain.findFirst({
    where: (d, { eq }) => eq(d.domain, host),
    with: { organization: true },
  })

  if (!foundDomain) {
    return NextResponse.rewrite(new URL("/404", req.url))
  }
  if (foundDomain.isRedirect && foundDomain.organization) {
    const newDomain = await db.query.domain.findFirst({
      where: (d, { eq, and }) =>
        and(eq(d.orgId, foundDomain.orgId), eq(d.isActive, true)),
    })
    if (newDomain) {
      return NextResponse.redirect(
        new URL(req.nextUrl.pathname, `https://${newDomain.domain}`)
      )
    }
  }
  const rewriteUrl = new URL(
    `/affiliate/${foundDomain.orgId}${req.nextUrl.pathname}`,
    req.url
  )

  return NextResponse.rewrite(rewriteUrl)
}
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
