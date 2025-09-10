"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export interface SellerTokenPayload {
  id: string
  email: string
  role: "ADMIN" | "OWNER"
  type: "SELLER"
  orgId?: string
  iat: number
  exp: number
}

export async function getSellerAuth(): Promise<SellerTokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("sellerToken")?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as SellerTokenPayload

    if (decoded.type !== "SELLER" || !decoded.id || !decoded.email) {
      return null
    }

    return decoded
  } catch {
    return null
  }
}
