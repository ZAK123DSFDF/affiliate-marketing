"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { returnError } from "@/lib/errorHandler"

export async function switchOrganization(newOrgId: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("organizationToken")?.value
    if (!token) throw { status: 401, error: "Unauthorized" }

    const decoded = jwt.decode(token) as {
      id: string
      email: string
      role: string
      type: string
      exp: number
      iat: number
      orgIds?: string[]
      activeOrgId?: string
    }

    if (!decoded.orgIds?.includes(newOrgId)) {
      throw { status: 403, error: "You don’t belong to this organization" }
    }

    const { exp, iat, ...rest } = decoded
    const newPayload = {
      ...rest,
      activeOrgId: newOrgId,
    }

    // preserve the same expiration
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
    const newToken = jwt.sign(newPayload, process.env.SECRET_KEY!, {
      expiresIn,
    })

    cookieStore.set("organizationToken", newToken, { httpOnly: true })

    return { ok: true }
  } catch (err) {
    console.error("Switch org error", err)
    return returnError(err)
  }
}
