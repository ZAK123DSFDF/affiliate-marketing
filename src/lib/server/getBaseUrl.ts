"use server"
import { headers } from "next/headers"

export async function getBaseUrl() {
  const hdrs = await headers()
  const currentHost =
    hdrs.get("x-current-host") || // custom, if set by middleware
    hdrs.get("host") // standard host header sent by browser

  if (!currentHost)
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const protocol = currentHost.includes("localhost") ? "http" : "https"
  return `${protocol}://${currentHost}`
}
