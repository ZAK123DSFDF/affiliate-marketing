import {
  BillingType,
  SubscriptionCycle,
} from "@/components/ui-custom/Pricing/PricingClient"
import { PlanInfo } from "@/lib/types/planInfo"
import { FeatureList } from "@/lib/types/FeatureList"
import { PricingCard } from "@/components/ui-custom/Pricing/PricingCard"

export function PricingGrid({
  billingType,
  dashboard,
  plan,
  subscriptionCycle,
  featuresList,
  getButtonText,
}: {
  billingType: BillingType
  dashboard: boolean
  plan?: PlanInfo | null
  subscriptionCycle?: SubscriptionCycle
  featuresList: FeatureList[]
  getButtonText: (p: PlanInfo["plan"]) => string
}) {
  const getPrice = (tier: PlanInfo["plan"]) => {
    if (tier === "FREE") return "$0"

    if (billingType === "SUBSCRIPTION") {
      const monthlyPrice = tier === "PRO" ? 25 : 40
      if (subscriptionCycle === "MONTHLY") return `$${monthlyPrice} / month`
      if (subscriptionCycle === "YEARLY") {
        const yearlyPrice = Math.round(monthlyPrice * 12 * 0.84)
        return `$${yearlyPrice} / year`
      }
    } else {
      if (tier === "PRO") return "$85 one-time"
      if (tier === "ULTIMATE") return "$125 one-time"
    }
    return "-"
  }

  const getOldPrice = (tier: PlanInfo["plan"]) => {
    if (tier === "FREE") return null

    if (billingType === "SUBSCRIPTION") {
      const monthlyPrice = tier === "PRO" ? 35 : 55

      if (subscriptionCycle === "MONTHLY") return `$${monthlyPrice} / month`

      if (subscriptionCycle === "YEARLY") {
        // ✅ Apply 16% discount to old price comparison too
        const yearlyPrice = Math.round(monthlyPrice * 12 * 0.84)
        return `$${yearlyPrice} / year`
      }
    } else {
      if (tier === "PRO") return "$100 one-time"
      if (tier === "ULTIMATE") return "$150 one-time"
    }
    return null
  }

  const getDiscountPercent = (oldPrice?: string | null, newPrice?: string) => {
    if (!oldPrice || !newPrice) return null
    const oldNum = parseFloat(oldPrice.replace(/[^0-9.]/g, ""))
    const newNum = parseFloat(newPrice.replace(/[^0-9.]/g, ""))
    if (!oldNum || !newNum) return null
    const percent = Math.round(((oldNum - newNum) / oldNum) * 100)
    return percent > 0 ? percent : null
  }

  return (
    <div className="flex flex-wrap justify-center w-full gap-6">
      {!dashboard && (
        <PricingCard
          title="Free"
          price={getPrice("FREE")}
          features={[
            "Basic features",
            "1 organization",
            "No team member invitations",
          ]}
          buttonText="Start Free"
          disabled={plan?.plan === "FREE"}
        />
      )}

      <PricingCard
        title="Pro"
        price={getPrice("PRO")}
        oldPrice={getOldPrice("PRO")}
        discount={getDiscountPercent(getOldPrice("PRO"), getPrice("PRO"))}
        features={featuresList.filter((f) => f.pro).map((f) => f.name)}
        buttonText={getButtonText("PRO")}
        disabled={plan?.plan === "PRO" || plan?.plan === "ULTIMATE"}
      />

      <PricingCard
        title="Ultimate"
        price={getPrice("ULTIMATE")}
        oldPrice={getOldPrice("ULTIMATE")}
        discount={getDiscountPercent(
          getOldPrice("ULTIMATE"),
          getPrice("ULTIMATE")
        )}
        features={featuresList.filter((f) => f.ultimate).map((f) => f.name)}
        buttonText={getButtonText("ULTIMATE")}
        disabled={plan?.plan === "ULTIMATE"}
        highlight
      />
    </div>
  )
}
