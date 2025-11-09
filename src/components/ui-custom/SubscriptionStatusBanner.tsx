"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
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
  const { plan: planName, type: planType } = plan
  if (pathname.includes("/pricing")) return null
  if (planType === "EXPIRED") {
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
              asChild
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Link
                href={`/organization/${orgId}/dashboard/pricing`}
                scroll={false}
              >
                Renew Now
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return null
}
