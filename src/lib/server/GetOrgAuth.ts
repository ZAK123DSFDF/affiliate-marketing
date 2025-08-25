import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { organization } from "@/db/schema"
import { eq, InferSelectModel } from "drizzle-orm"
import { OrgAuthResult } from "@/lib/types/orgAuth"

export async function getOrgAuth(orgId: string): Promise<OrgAuthResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) throw { status: 401, toast: "Unauthorized" }

  const { id: userId } = jwt.decode(token) as { id: string }
  const isMember = await db.query.userToOrganization.findFirst({
    where: (t, { and, eq }) =>
      and(eq(t.userId, userId), eq(t.organizationId, orgId)),
  })
  if (!isMember) throw { status: 403, toast: "Forbidden" }
  const org = await db
    .select({
      domain: organization.domainName,
      param: organization.referralParam,
    })
    .from(organization)
    .where(eq(organization.id, orgId))
    .then((r) => r[0])
  if (!org) throw { status: 404, toast: "Org not found" }
  return org
}
