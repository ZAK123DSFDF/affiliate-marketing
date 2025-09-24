"use client"

import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"

export function AuthCustomizationProvider({
  orgId,
  children,
}: {
  orgId: string
  children: React.ReactNode
}) {
  const { isPending, isError, refetch } = useCustomizationSync(orgId, "auth")

  if (isPending) return <PendingState />
  if (isError) return <ErrorState onRetry={refetch} />

  return <>{children}</>
}
