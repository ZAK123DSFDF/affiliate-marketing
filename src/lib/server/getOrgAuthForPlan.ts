import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getOrgAuthForPlan(): Promise<{
  userId: string
  orgId: string
}> {
  const cookieStore = await cookies()
  const token = cookieStore.get("sellerToken")?.value
  console.log("🔑 Raw sellerToken:", token)

  if (!token) throw { status: 401, toast: "Unauthorized" }

  const decoded = jwt.decode(token) as { id: string; activeOrgId: string }
  console.log("🔓 Decoded sellerToken:", decoded)
  if (!decoded?.id || !decoded?.activeOrgId)
    throw { status: 401, toast: "Unauthorized" }

  return { userId: decoded.id, orgId: decoded.activeOrgId }
}
