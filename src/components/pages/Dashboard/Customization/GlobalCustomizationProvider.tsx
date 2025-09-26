"use client"

import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"

export function GlobalCustomizationProvider({
  orgId,
  children,
  isDashboard = false,
}: {
  orgId: string
  children: React.ReactNode
  isDashboard?: boolean
}) {
  const { isPending, isError, refetch } = useCustomizationSync(orgId, "both")

  if (isPending) return <PendingState withoutBackground={isDashboard} />
  if (isError) return <ErrorState onRetry={refetch} />

  return <>{children}</>
}
