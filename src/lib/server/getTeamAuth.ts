"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export interface TeamTokenPayload {
  id: string
  email: string
  role: "TEAM" | "OWNER"
  type: "ORGANIZATION"
  orgIds: string[]
  iat: number
  exp: number
  orgId?: string
}

export async function getTeamAuth(
  orgId: string
): Promise<TeamTokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(`teamToken-${orgId}`)?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as TeamTokenPayload

    if (decoded.type !== "ORGANIZATION" || !decoded.id || !decoded.email) {
      return null
    }
    return decoded
  } catch {
    return null
  }
}
