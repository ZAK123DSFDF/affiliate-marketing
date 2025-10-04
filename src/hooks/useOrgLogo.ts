// hooks/useOrgLogo.ts
"use client"

import { useEffect } from "react"
import { useAtom } from "jotai"
import { logoUrlAtom } from "@/store/OrgAtom"

export function useOrgLogo(initialLogoUrl?: string | null) {
  const [logoUrl, setLogoUrl] = useAtom(logoUrlAtom)

  useEffect(() => {
    if (initialLogoUrl) {
      setLogoUrl(initialLogoUrl)
    }
  }, [initialLogoUrl, setLogoUrl])

  return { logoUrl, setLogoUrl }
}
