// auth.ts
import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("organizationToken")?.value
  if (!token) throw { status: 401, toast: "Unauthorized" }
  const payload = jwt.verify(token, process.env.SECRET_KEY as string) as {
    id?: string
  }
  if (!payload?.id) throw { status: 400, toast: "Invalid session" }

  return { id: payload.id }
}
