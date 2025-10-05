"use client"

import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"

export function AuthCustomizationProvider({
  orgId,
  children,
  affiliate,
}: {
  orgId: string
  children: React.ReactNode
  affiliate: boolean
}) {
  const { isPending, isError, refetch } = useCustomizationSync(orgId, "auth")

  if (isPending) return <PendingState affiliate={affiliate} />
  if (isError) return <ErrorState onRetry={refetch} affiliate={affiliate} />

  return <>{children}</>
}
