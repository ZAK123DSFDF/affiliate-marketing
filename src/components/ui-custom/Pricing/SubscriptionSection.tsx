import { PlanInfo } from "@/lib/types/planInfo"
import { FeatureList } from "@/lib/types/FeatureList"
import { SubscriptionCycle } from "@/components/ui-custom/Pricing/PricingClient"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PricingGrid } from "@/components/ui-custom/Pricing/PricingGrid"
import { getResponsiveTabSize } from "@/util/GetResponsiveTabSize"

export function SubscriptionSection({
  dashboard,
  plan,
  featuresList,
  getButtonText,
  subscriptionCycle,
  setSubscriptionCycle,
}: {
  dashboard: boolean
  plan?: PlanInfo | null
  featuresList: FeatureList[]
  getButtonText: (p: PlanInfo["plan"]) => string
  subscriptionCycle: SubscriptionCycle
  setSubscriptionCycle: (v: SubscriptionCycle) => void
}) {
  return (
    <>
      {/* Monthly / Yearly Switch (always visible) */}
      <div className="flex justify-center mb-6">
        <Tabs
          value={subscriptionCycle}
          onValueChange={(v) => setSubscriptionCycle(v as SubscriptionCycle)}
          className="bg-gray-100 rounded-xl px-4 py-3"
        >
          <TabsList className="flex gap-4">
            <TabsTrigger
              value="MONTHLY"
              className={cn(
                getResponsiveTabSize(0.85),
                "font-medium transition-all duration-200 rounded-lg",
                subscriptionCycle === "MONTHLY"
                  ? "bg-primary text-white shadow-md scale-[1.02]"
                  : "text-gray-700 hover:text-black hover:bg-gray-200/50"
              )}
            >
              Monthly
            </TabsTrigger>

            <TabsTrigger
              value="YEARLY"
              className={cn(
                getResponsiveTabSize(0.85),
                "font-medium transition-all duration-200 rounded-lg flex items-center justify-center gap-2",
                subscriptionCycle === "YEARLY"
                  ? "bg-primary text-white shadow-md scale-[1.02]"
                  : "text-gray-700 hover:text-black hover:bg-gray-200/50"
              )}
            >
              Yearly
              {subscriptionCycle === "YEARLY" ? (
                <span className="text-xs bg-green-400 text-black font-semibold px-2 py-0.5 rounded-md">
                  Save 16%
                </span>
              ) : (
                <span className="text-xs text-green-600 font-semibold">
                  Save 16%
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <PricingGrid
        billingType="SUBSCRIPTION"
        dashboard={dashboard}
        plan={plan}
        subscriptionCycle={subscriptionCycle}
        featuresList={featuresList}
        getButtonText={getButtonText}
      />
    </>
  )
}
