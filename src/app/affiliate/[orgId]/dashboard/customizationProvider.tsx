"use client"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"

export function CustomizationProvider({
  orgId,
  children,
  affiliate,
}: {
  orgId: string
  children: React.ReactNode
  affiliate: boolean
}) {
  const { isPending, isError, refetch } = useCustomizationSync(
    orgId,
    "dashboard"
  )

  if (isPending) {
    return <PendingState affiliate={affiliate} withoutBackground />
  }
  if (isError) {
    return <ErrorState affiliate={affiliate} onRetry={refetch} />
  }

  return <>{children}</>
}
