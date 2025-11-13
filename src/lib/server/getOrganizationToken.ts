"use server"

import { cookies } from "next/headers"

export async function getOrganizationToken() {
  const cookieStore = await cookies()
  return cookieStore.get("organizationToken")?.value || null
}
