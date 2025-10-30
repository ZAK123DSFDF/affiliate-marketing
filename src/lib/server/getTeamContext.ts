// lib/server/getOrganizationContext.ts
"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getTeamContext(orgId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get(`teamToken-${orgId}`)?.value
  if (!token) throw { status: 401, error: "Unauthorized" }

  const decoded = jwt.decode(token) as {
    orgId?: string
    role?: string
    type?: string
  }

  return {
    orgId: decoded?.orgId ?? orgId,
    role: decoded?.role ?? "TEAM",
    type: decoded?.type ?? "ORGANIZATION",
  }
}
