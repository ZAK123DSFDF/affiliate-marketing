"use server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export const checkAuth = async () => {
  const tokenCookie = await cookies()
  const token = tokenCookie.get("token")
  if (!token) {
    return { isAuthenticated: false }
  }

  try {
    // Verify and decode in one step
    const decoded = jwt.verify(token.value, process.env.secret as string) as {
      user: number
      email: string
      role: string
      exp: number
      iat: number
    }
    const currentTime = Math.floor(Date.now() / 1000)
    if (decoded.exp && currentTime > decoded.exp) {
      tokenCookie.delete("token")
      return { isAuthenticated: false }
    }

    return {
      isAuthenticated: true,
      id: decoded.user,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    tokenCookie.delete("token")
    return { isAuthenticated: false }
  }
}
