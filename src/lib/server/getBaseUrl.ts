"use server"
import { headers } from "next/headers"

export async function getBaseUrl() {
  const host = (await headers()).get("x-current-host")
  if (!host) return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `https://${host}`
}
