"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAffiliatePaymentMethod } from "@/app/affiliate/[orgId]/dashboard/profile/action"
import { ResponseData } from "@/lib/types/response"
import { useDashboardCard } from "@/hooks/useDashboardCard"
import { cn } from "@/lib/utils"
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions"
import React from "react"
type MissingPaypalEmailCardProps = {
  orgId: string
  affiliate: boolean
  isPreview?: boolean
  onOpenProfile?: () => void
}
export function MissingPaypalEmailCard({
  orgId,
  affiliate,
  isPreview = false,
  onOpenProfile,
}: MissingPaypalEmailCardProps) {
  const router = useRouter()
  const dashboardCardStyle = useDashboardCard(affiliate)
  const { data, isLoading } = useQuery<ResponseData<AffiliatePaymentMethod>>({
    queryKey: ["affiliatePaymentMethod", orgId],
    queryFn: () => getAffiliatePaymentMethod(orgId), // pass orgId here
  })

  if (isLoading) return null
  if (!data?.ok || data.data?.paypalEmail) return null

  const handleAddPayPal = () => {
    if (isPreview && typeof onOpenProfile === "function") {
      onOpenProfile()
      return
    }
    router.push(`/affiliate/${orgId}/dashboard/profile`)
  }
  return (
    <Card
      className={cn("relative", isPreview && "mt-2")}
      style={dashboardCardStyle}
    >
      {isPreview && affiliate && (
        <div className="absolute bottom-0 left-0 p-2">
          <DashboardCardCustomizationOptions
            triggerSize="w-6 h-6"
            dropdownSize="w-[150px]"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>No PayPal Email Added</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You haven’t added a PayPal email yet. Please add one to receive
          payouts.
        </p>
        <Button
          className={cn("mt-4", isPreview && "mb-4")}
          onClick={handleAddPayPal}
        >
          Add PayPal Email
        </Button>
      </CardContent>
    </Card>
  )
}
