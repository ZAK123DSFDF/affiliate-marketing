"use client"

import { usePathname, useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { PlanInfo } from "@/lib/types/planInfo"

interface SubscriptionStatusBannerProps {
  plan: PlanInfo
  orgId: string
}

export function SubscriptionStatusBanner({
  plan,
  orgId,
}: SubscriptionStatusBannerProps) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname.includes("/pricing")) return null
  if (plan.type !== "EXPIRED") return null

  const handleRenewClick = () => {
    router.push(`/organization/${orgId}/dashboard/pricing`)
  }

  return (
    <div className="mb-4">
      <Alert
        variant="destructive"
        className="border-destructive bg-destructive/10 text-destructive"
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="font-semibold">
          Your {plan.plan} plan has expired
        </AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-3">
          <span>Please renew to continue accessing premium features.</span>
          <Button onClick={handleRenewClick}>Renew Now</Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
