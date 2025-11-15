import { getUserPlan } from "@/lib/server/getUserPlan"
import PricingClient from "@/components/ui-custom/Pricing/PricingClient"

export default async function PricingPage() {
  const plan = await getUserPlan()
  const showSubscription = !(
    plan?.type === "PURCHASE" &&
    (plan?.plan === "PRO" || plan?.plan === "ULTIMATE")
  )

  return (
    <PricingClient
      plan={plan}
      dashboard={true}
      showSubscription={showSubscription}
    />
  )
}
