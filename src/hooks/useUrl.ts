"use client"

import { useRouter } from "next/navigation"

export function useAffiliatePath(orgId: string) {
  const router = useRouter()
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const host = window.location.host
  const isMainHost =
    host.includes("localhost:3000") || host === "refearnapp.com"
  function getPath(path: string) {
    return isMainHost ? `/affiliate/${orgId}/${path}` : `/${path}`
  }

  function goTo(path: string) {
    router.push(getPath(path))
  }
  return { goTo, getPath, isMainHost, baseUrl }
}
