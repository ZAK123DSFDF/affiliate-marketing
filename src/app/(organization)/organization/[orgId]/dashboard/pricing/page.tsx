import { getUserPlan } from "@/lib/server/getUserPlan"
import PricingClient from "@/components/ui-custom/PricingClient"

export default async function PricingPage() {
  const plan = await getUserPlan()
  return <PricingClient plan={plan} dashboard={true} showPurchase={false} />
}
