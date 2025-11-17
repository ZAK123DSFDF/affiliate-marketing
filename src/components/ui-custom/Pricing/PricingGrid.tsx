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
import { useAppMutation } from "@/hooks/useAppMutation"
import { updateSubscriptionAction } from "@/app/(organization)/organization/[orgId]/dashboard/pricing/action"

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
  const [pendingUpgrade, setPendingUpgrade] = useState<null | {
    subscriptionId: string
    targetPlan: Exclude<PlanInfo["plan"], "FREE">
    targetCycle?: SubscriptionCycle
    mode: "PRORATE" | "DO_NOT_BILL"
    modeType: "SUB_TO_SUB" | "SUB_TO_ONE_TIME"
  }>(null)
  const { openCheckout } = usePaddleCheckout()
  const mutation = useAppMutation(updateSubscriptionAction, {
    onSuccess: () => {
      if (pendingUpgrade?.modeType === "SUB_TO_ONE_TIME") {
        openCheckout({
          type: "PURCHASE",
          plan: pendingUpgrade.targetPlan,
        }).then(() => console.log("Checkout closed"))
      }
    },
  })
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
        }).then(() => console.log("Checkout closed"))
      } else {
        openCheckout({ type: "PURCHASE", plan: targetPlan }).then(() =>
          console.log("Checkout closed")
        )
      }
      return
    }

    // 🧠 1. Handle active paid SUBSCRIPTION users (PRO or ULTIMATE)
    if (
      plan.type === "SUBSCRIPTION" &&
      (plan.plan === "PRO" || plan.plan === "ULTIMATE")
    ) {
      if (!plan.subscriptionId) {
        return
      }
      if (isSubscriptionMode) {
        setPendingUpgrade({
          subscriptionId: plan.subscriptionId,
          targetPlan,
          targetCycle: subscriptionCycle || "MONTHLY",
          mode: "PRORATE",
          modeType: "SUB_TO_SUB",
        })
        setDialogOpen(true)
        return
      }

      if (isPurchaseMode) {
        let mode: "PRORATE" | "DO_NOT_BILL" = "PRORATE"
        if (plan.plan === "ULTIMATE" && targetPlan === "PRO") {
          mode = "DO_NOT_BILL"
        }
        setPendingUpgrade({
          subscriptionId: plan.subscriptionId,
          targetPlan,
          mode,
          modeType: "SUB_TO_ONE_TIME",
        })
        setDialogOpen(true)
        return
      }
    }

    // 🧠 2. Handle EXPIRED plans
    if (plan.type === "EXPIRED") {
      if (!plan.subscriptionId) {
        return
      }

      if (isSubscriptionMode) {
        setPendingUpgrade({
          subscriptionId: plan.subscriptionId,
          targetPlan,
          targetCycle: subscriptionCycle || "MONTHLY",
          mode: "PRORATE",
          modeType: "SUB_TO_SUB",
        })
        setDialogOpen(true)
        return
      }

      if (isPurchaseMode) {
        setPendingUpgrade({
          subscriptionId: plan.subscriptionId,
          targetPlan,
          mode: "PRORATE",
          modeType: "SUB_TO_ONE_TIME",
        })
        setDialogOpen(true)
        return
      }
    }

    // 🧠 3. Fallback: open checkout normally
    if (isSubscriptionMode) {
      openCheckout({
        type: "SUBSCRIPTION",
        plan: targetPlan,
        cycle: subscriptionCycle || "MONTHLY",
      }).then(() => console.log("Checkout closed"))
    } else {
      openCheckout({
        type: "PURCHASE",
        plan: targetPlan,
        currentPlan: plan,
      }).then(() => console.log("Checkout closed"))
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
  function getDialogMessage(
    plan: PlanInfo | null,
    pending: NonNullable<typeof pendingUpgrade>
  ) {
    // Only care about SUB → PURCHASE transitions
    if (pending.modeType !== "SUB_TO_ONE_TIME") return ""

    // If expired → fallback to generic dialog text
    if (!plan || plan.type === "EXPIRED") {
      return `Upgrade to ${pending.targetPlan} one-time?`
    }

    const isUltimateToPro =
      plan.plan === "ULTIMATE" && pending.targetPlan === "PRO"

    const isProToUltimate =
      plan.plan === "PRO" && pending.targetPlan === "ULTIMATE"

    const isSameTier = plan.plan === pending.targetPlan

    // 1️⃣ ULTIMATE → PRO downgrade
    if (isUltimateToPro) {
      return `Your current ULTIMATE subscription will stay active until the end of your billing period.
Are you sure you want to buy the PRO one-time plan now?
It will only be applied when your subscription ends.`
    }

    // 2️⃣ PRO → ULTIMATE upgrade
    if (isProToUltimate) {
      return `Your current PRO subscription will be cancelled immediately.
Are you sure you want to buy the ULTIMATE one-time plan?`
    }

    // 3️⃣ Same tier (PRO → PRO or ULTIMATE → ULTIMATE)
    if (isSameTier) {
      return `Your current subscription will be cancelled immediately.
Are you sure you want to switch to the one-time plan?`
    }

    // Fallback: generic
    return `Upgrade to ${pending.targetPlan} one-time?`
  }

  const isDisabled = (targetPlan: PlanInfo["plan"]) => {
    // No plan → always enabled
    if (!plan) return false

    // Different billing type → enable (e.g. switching sub <-> purchase)
    if (plan.type !== billingType) return false

    // If target is lower (downgrade) → never disable
    if (targetPlan === "PRO" && plan.plan === "ULTIMATE") {
      return false
    }

    // If Ultimate: disable only if SAME cycle and target is Ultimate
    if (plan.plan === "ULTIMATE") {
      return targetPlan === "ULTIMATE" && plan.cycle === subscriptionCycle
    }

    // If PRO: disable only if same plan AND same cycle
    if (plan.plan === "PRO" && targetPlan === "PRO") {
      return plan.cycle === subscriptionCycle
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
        title="Confirm Upgrade"
        description={
          pendingUpgrade ? getDialogMessage(plan ?? null, pendingUpgrade) : ""
        }
        confirmText="Upgrade Now"
        confirmLoading={mutation.isPending}
        onConfirm={() => {
          if (pendingUpgrade) mutation.mutate(pendingUpgrade)
          setDialogOpen(false)
          setPendingUpgrade(null)
        }}
        affiliate={false}
      />
    </>
  )
}
