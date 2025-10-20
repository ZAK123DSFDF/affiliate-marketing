// hooks/useActiveDomain.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { getActiveDomain } from "@/lib/server/getActiveDomain"

export function useActiveDomain(orgId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["activeDomain", orgId],
    queryFn: () => getActiveDomain(orgId),
    enabled: !!orgId,
  })

  return { domain: data?.domainName, isLoading, isError }
}
