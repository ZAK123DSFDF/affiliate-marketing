import { PlanInfo } from "@/lib/types/planInfo"
import { useRouter } from "next/navigation"

export const handlePlanRedirect = (
  plan: PlanInfo,
  orgId: string,
  openPortal: () => void,
  router: ReturnType<typeof useRouter>
) => {
  // 🆓 Free → go to pricing
  if (plan.plan === "FREE") {
    router.push(`/organization/${orgId}/dashboard/pricing`)
    return
  }

  // 💼 PRO one-time purchase → go to pricing
  if (plan.type === "PURCHASE") {
    router.push(`/organization/${orgId}/dashboard/pricing`)
    return
  }

  // 🔁 Subscription → open Paddle portal
  if (plan.type === "SUBSCRIPTION") {
    openPortal()
    return
  }

  // ⚠️ Expired (PRO or ULTIMATE) → open Paddle portal
  if (
    plan.type === "EXPIRED" &&
    (plan.plan === "PRO" || plan.plan === "ULTIMATE")
  ) {
    openPortal()
    return
  }

  // Default fallback
  router.push(`/organization/${orgId}/dashboard/pricing`)
}
