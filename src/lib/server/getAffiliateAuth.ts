"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export interface AffiliateTokenPayload {
  id: string
  email: string
  type: "AFFILIATE"
  orgId: string
  iat: number
  exp: number
}

export async function getAffiliateAuth(orgId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get(`affiliateToken-${orgId}`)?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as AffiliateTokenPayload

    if (decoded.type !== "AFFILIATE" || !decoded.id || !decoded.email) {
      return null
    }

    return decoded
  } catch {
    return null
  }
}
