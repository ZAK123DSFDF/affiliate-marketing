"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAppQuery } from "@/hooks/useAppQuery"
import { verifyAndDeleteTeamSessionAction } from "@/lib/server/verifyAndDeleteTeamSessionAction"

export function useVerifyTeamSession(orgId?: string, isTeam?: boolean) {
  const router = useRouter()

  const query = useAppQuery(
    ["verify-team-session", orgId],
    verifyAndDeleteTeamSessionAction,
    [orgId!],
    { enabled: !!orgId && isTeam } // ✅ only run if team
  )

  useEffect(() => {
    if (query.error) {
      router.push(`/organization/${orgId}/teams/login`)
    }
  }, [query.error, router, orgId])

  return null
}
