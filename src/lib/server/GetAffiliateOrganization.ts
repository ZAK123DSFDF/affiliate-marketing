import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getAffiliateOrganization() {
  const cookieStore = await cookies()
  const token = cookieStore.get("affiliateToken")?.value

  if (!token) throw new Error("Unauthorized")

  const decoded = jwt.decode(token) as {
    id: string
    orgId: string
  }
  if (!decoded) throw { status: 400, toast: "Invalid session" }
  return decoded
}
