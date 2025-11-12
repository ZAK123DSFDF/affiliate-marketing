"use client"

import React, { useState } from "react"
import {
  BillingType,
  SubscriptionCycle,
} from "@/components/ui-custom/Pricing/PricingClient"
import { PlanInfo } from "@/lib/types/planInfo"
import { FeatureList } from "@/lib/types/FeatureList"
import { PricingCard } from "@/components/ui-custom/Pricing/PricingCard"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout"
import { usePaddlePortal } from "@/hooks/usePaddlePortal"

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
  getButtonText: (p: PlanInfo["plan"], t: PlanInfo["type"]) => string
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogText, setDialogText] = useState("")
  const { openPortal } = usePaddlePortal()
  const { openCheckout } = usePaddleCheckout()
  const handleBuyClick = (targetPlan: PlanInfo["plan"]) => {
    if (targetPlan === "FREE") {
      // No checkout needed for Free tier
      return
    }

    const isSubscriptionMode = billingType === "SUBSCRIPTION"
    const isPurchaseMode = billingType === "PURCHASE"

    // 🧠 0. No active plan → directly open checkout
    if (!plan || plan.plan === "FREE") {
      if (isSubscriptionMode) {
        openCheckout({
          type: "SUBSCRIPTION",
          plan: targetPlan,
          cycle: subscriptionCycle || "MONTHLY",
        })
      } else {
        openCheckout({ type: "PURCHASE", plan: targetPlan })
      }
      return
    }

    // 🧠 1. Handle active paid SUBSCRIPTION users (PRO or ULTIMATE)
    if (
      plan.type === "SUBSCRIPTION" &&
      (plan.plan === "PRO" || plan.plan === "ULTIMATE")
    ) {
      if (isSubscriptionMode) {
        setDialogText(
          `You're already subscribed. To upgrade or change your ${targetPlan} plan, please use the customer portal.`
        )
        setDialogOpen(true)
        return
      } else if (isPurchaseMode) {
        setDialogText(
          `You need to cancel your current subscription before purchasing the ${targetPlan} bundle.`
        )
        setDialogOpen(true)
        return
      }
    }

    // 🧠 2. Handle EXPIRED plans
    if (plan.type === "EXPIRED") {
      // ⚠️ If plan is PRO/ULTIMATE and user tries to buy one-time → show dialog to cancel first
      if ((plan.plan === "PRO" || plan.plan === "ULTIMATE") && isPurchaseMode) {
        setDialogText(
          `Your ${plan.plan} subscription has expired, but you still need to cancel it from your portal before purchasing a one-time ${targetPlan} bundle.`
        )
        setDialogOpen(true)
        return
      }

      // Otherwise (if subscription mode or lower plan), proceed as usual
      if (isSubscriptionMode) {
        openCheckout({
          type: "SUBSCRIPTION",
          plan: targetPlan,
          cycle: subscriptionCycle || "MONTHLY",
        })
      } else {
        openCheckout({ type: "PURCHASE", plan: targetPlan })
      }
      return
    }

    // 🧠 3. Fallback: open checkout normally
    if (isSubscriptionMode) {
      openCheckout({
        type: "SUBSCRIPTION",
        plan: targetPlan,
        cycle: subscriptionCycle || "MONTHLY",
      })
    } else {
      openCheckout({ type: "PURCHASE", plan: targetPlan })
    }
  }

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
      const proPrice = 85
      const ultimatePrice = 125
      if (tier === "PRO") return `$${proPrice} one-time`
      if (tier === "ULTIMATE") {
        if (plan?.type === "PURCHASE" && plan?.plan === "PRO") {
          const upgradePrice = ultimatePrice - proPrice
          return `$${upgradePrice} upgrade`
        }
        return `$${ultimatePrice} one-time`
      }
    }
    return "-"
  }

  const getOldPrice = (tier: PlanInfo["plan"]) => {
    if (tier === "FREE") return null
    if (billingType === "SUBSCRIPTION") {
      const monthlyPrice = tier === "PRO" ? 35 : 55
      if (subscriptionCycle === "MONTHLY") return `$${monthlyPrice} / month`
      if (subscriptionCycle === "YEARLY") {
        const yearlyPrice = Math.round(monthlyPrice * 12 * 0.84)
        return `$${yearlyPrice} / year`
      }
    } else {
      const oldProPrice = 100
      const oldUltimatePrice = 150
      if (tier === "PRO") return "$100 one-time"
      if (tier === "ULTIMATE") {
        if (plan?.type === "PURCHASE" && plan?.plan === "PRO") {
          const discountedOld = oldUltimatePrice - oldProPrice
          return `$${discountedOld} one-time`
        }
        return "$150 one-time"
      }
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

  const isDisabled = (targetPlan: PlanInfo["plan"]) => {
    if (!plan) return false
    if (plan.type === billingType) {
      if (plan.plan === "ULTIMATE") return true
      if (plan.plan === "PRO" && targetPlan === "PRO") return true
    }
    return false
  }

  return (
    <>
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
            onClick={() => handleBuyClick("FREE")}
          />
        )}

        <PricingCard
          title="Pro"
          price={getPrice("PRO")}
          oldPrice={getOldPrice("PRO")}
          discount={getDiscountPercent(getOldPrice("PRO"), getPrice("PRO"))}
          features={featuresList.filter((f) => f.pro).map((f) => f.name)}
          buttonText={getButtonText("PRO", billingType)}
          disabled={isDisabled("PRO")}
          onClick={() => handleBuyClick("PRO")}
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
          buttonText={getButtonText("ULTIMATE", billingType)}
          disabled={isDisabled("ULTIMATE")}
          highlight
          onClick={() => handleBuyClick("ULTIMATE")}
        />
      </div>

      {/* ⚙️ AppDialog Integration */}
      <AppDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Cancel Subscription First"
        description={dialogText}
        confirmText="Cancel Subscription"
        onConfirm={() => {
          openPortal()
          setDialogOpen(false)
        }}
        affiliate={false}
      />
    </>
  )
}
