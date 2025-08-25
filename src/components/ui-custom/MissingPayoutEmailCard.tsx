"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAffiliatePaymentMethod } from "@/app/affiliate/[orgId]/dashboard/profile/action"
type MissingPaypalEmailCardProps = {
  orgId: string
}
export function MissingPaypalEmailCard({ orgId }: MissingPaypalEmailCardProps) {
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["affiliateData"],
    queryFn: getAffiliatePaymentMethod,
  })

  if (isLoading) return null
  if (!data?.ok || data.data?.paypalEmail) return null

  return (
    <Card className="border-red-500">
      <CardHeader>
        <CardTitle>No PayPal Email Added</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You haven’t added a PayPal email yet. Please add one to receive
          payouts.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push(`/affiliate/${orgId}/dashboard/profile`)}
        >
          Add PayPal Email
        </Button>
      </CardContent>
    </Card>
  )
}
