// app/dashboard/analytics/layout.tsx
import { MissingPaypalEmailCard } from "@/components/ui-custom/MissingPayoutEmailCard"
import React from "react"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { CustomizationProvider } from "@/app/affiliate/[orgId]/dashboard/customizationProvider"

interface AnalyticsLayoutProps {
  children: React.ReactNode
  params: Promise<{ orgId: string }>
  cards: React.ReactNode
  charts: React.ReactNode
  referrers: React.ReactNode
}

export default async function AnalyticsLayout({
  children,
  params,
  cards,
  charts,
  referrers,
}: AnalyticsLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  return (
    <div className="space-y-8">
      {children}
      <MissingPaypalEmailCard affiliate orgId={orgId} />
      {cards}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">{charts}</div>
        <div className="h-full">{referrers}</div>
      </div>
    </div>
  )
}
