import { db } from "@/db/drizzle"
import { and, eq, gt } from "drizzle-orm"
import { invitation } from "@/db/schema"

export async function getTeamValidation(teamToken?: string) {
  if (!teamToken) return null

  return await db.query.invitation.findFirst({
    where: and(
      eq(invitation.token, teamToken),
      eq(invitation.accepted, false),
      gt(invitation.expiresAt, new Date())
    ),
  })
}
