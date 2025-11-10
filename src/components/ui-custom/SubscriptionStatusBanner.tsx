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
  const { plan: planName, type: planType } = plan

  if (pathname.includes("/pricing")) return null

  if (planType === "EXPIRED") {
    const handleRenewClick = () => {
      if (planName === "FREE") {
        // ✅ Free + Expired → redirect to pricing page
        router.push(`/organization/${orgId}/dashboard/pricing`)
      } else if (planName === "PRO" || planName === "ULTIMATE") {
        // ✅ PRO or ULTIMATE expired → just log for now
        console.log(
          `Renew clicked for ${planName} subscription (expired) — show renewal flow here later.`
        )
      }
    }

    return (
      <div className="mb-4">
        <Alert
          variant="destructive"
          className="border-destructive bg-destructive/10 text-destructive"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Your {planName} plan has expired
          </AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-3">
            <span>
              Please renew your plan to continue accessing premium features.
            </span>
            <Button
              onClick={handleRenewClick}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Renew Now
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return null
}
