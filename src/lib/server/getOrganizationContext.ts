// lib/server/getOrganizationContext.ts
"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getOrganizationContext() {
  const cookieStore = await cookies()
  const token = cookieStore.get("sellerToken")?.value
  if (!token) throw { status: 401, error: "Unauthorized" }

  const decoded = jwt.decode(token) as {
    orgIds?: string[]
    activeOrgId?: string
    role?: string
    type?: string
  }

  return {
    orgIds: decoded?.orgIds ?? [],
    activeOrgId: decoded?.activeOrgId,
    role: decoded?.role ?? "OWNER",
    type: decoded?.type ?? "SELLER",
  }
}
