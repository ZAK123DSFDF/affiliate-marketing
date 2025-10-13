"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export interface OrganizationTokenPayload {
  id: string
  email: string
  role: "ADMIN" | "OWNER"
  type: "ORGANIZATION"
  orgIds: string[]
  iat: number
  exp: number
  activeOrgId?: string
}

export async function getOrganizationAuth(): Promise<OrganizationTokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("organizationToken")?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as OrganizationTokenPayload

    if (decoded.type !== "ORGANIZATION" || !decoded.id || !decoded.email) {
      return null
    }
    return decoded
  } catch {
    return null
  }
}
