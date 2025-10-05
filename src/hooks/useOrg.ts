"use client"

import { useQuery } from "@tanstack/react-query"
import { Organization } from "@/lib/types/orgAuth"
import { getOrg } from "@/lib/server/getOrg"

export function useOrg(orgId?: string, affiliate?: boolean) {
  const {
    data: org,
    isLoading,
    isError,
    error,
  } = useQuery<Organization>({
    queryKey: ["org", orgId],
    queryFn: () => {
      if (!orgId) throw new Error("No orgId provided")
      return getOrg(orgId)
    },
    enabled: !!affiliate && !!orgId,
  })

  return { org, isLoading, isError, error }
}
