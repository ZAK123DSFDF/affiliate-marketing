"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { PlanInfo } from "@/lib/types/planInfo"

type BillingType = "SUBSCRIPTION" | "PURCHASE"
type SubscriptionCycle = "MONTHLY" | "YEARLY"
type PricingClientProps = {
  dashboard?: boolean
  plan?: PlanInfo | null
}

type Feature = {
  name: string
  pro: boolean
  ultimate: boolean
}

const featuresList: Feature[] = [
  { name: "Unlimited affiliates signup", pro: true, ultimate: true },
  { name: "Unlimited revenue from affiliate", pro: true, ultimate: true },
  { name: "PayPal mass payout", pro: true, ultimate: true },
  { name: "Custom domain", pro: true, ultimate: true },
  { name: "Affiliate page customization", pro: true, ultimate: true },
  { name: "Integrate with Stripe and Paddle", pro: true, ultimate: true },
  {
    name: "First-time & last-time cookie attribution customization",
    pro: true,
    ultimate: true,
  },
  {
    name: "Set how long affiliates earn commissions",
    pro: true,
    ultimate: true,
  },
  { name: "1 organization", pro: true, ultimate: false },
  { name: "Unlimited organizations", pro: false, ultimate: true },
  { name: "Up to 3 team member invitations", pro: true, ultimate: false },
  { name: "Unlimited team member invitations", pro: false, ultimate: true },
]

export default function PricingClient({
  dashboard = false,
  plan,
}: PricingClientProps) {
  const [activeTab, setActiveTab] = useState<BillingType>("PURCHASE")
  const [subscriptionCycle, setSubscriptionCycle] =
    useState<SubscriptionCycle>("MONTHLY")

  const isCurrentPlan = (targetPlan: PlanInfo["plan"]) =>
    plan?.plan === targetPlan

  const getButtonText = (targetPlan: PlanInfo["plan"]) => {
    if (!plan) return "Select Plan"
    if (isCurrentPlan(targetPlan)) return "Current Plan"
    if (targetPlan === "PRO") {
      return plan?.type === "PURCHASE"
        ? "Purchase Ultimate Bundle"
        : "Upgrade to Pro"
    }
    if (targetPlan === "ULTIMATE") {
      return plan?.type === "PURCHASE"
        ? "Purchase Ultimate Bundle"
        : "Upgrade to Ultimate"
    }
    return "Select Plan"
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Choose Your Plan</h1>

      {/* 🌟 Top-level Tabs (One-Time / Subscription) */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as BillingType)}
        className="w-full flex flex-col items-center "
      >
        <TabsList className="flex justify-center gap-4 px-4 mb-8 py-10 bg-gray-100 rounded-xl">
          <TabsTrigger
            value="PURCHASE"
            className={cn(
              "min-w-[140px] px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2",
              activeTab === "PURCHASE"
                ? "bg-primary text-white shadow-md scale-[1.02]"
                : "text-gray-700 hover:bg-gray-200/60 hover:scale-[1.03]"
            )}
          >
            One-Time{" "}
            <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-md">
              Special Offer
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="SUBSCRIPTION"
            className={cn(
              "min-w-[140px] px-6 py-3 text-base font-medium rounded-lg transition-all duration-200",
              activeTab === "SUBSCRIPTION"
                ? "bg-primary text-white shadow-md scale-[1.02]"
                : "text-gray-700 hover:bg-gray-200/60 hover:scale-[1.03]"
            )}
          >
            Subscription
          </TabsTrigger>
        </TabsList>

        {/* 🧾 Subscription content */}
        <TabsContent value="SUBSCRIPTION" className="w-full">
          {/* Monthly / Yearly Switch */}
          <div className="flex justify-center mb-6">
            <Tabs
              value={subscriptionCycle}
              onValueChange={(v) =>
                setSubscriptionCycle(v as SubscriptionCycle)
              }
              className="bg-gray-100 rounded-xl px-4 py-3"
            >
              <TabsList className="flex gap-4">
                <TabsTrigger
                  value="MONTHLY"
                  className={cn(
                    "min-w-[130px] px-6 py-3 rounded-lg text-base font-medium transition-all duration-200",
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
                    "flex items-center justify-center gap-2 min-w-[130px] px-6 py-3 rounded-lg text-base font-medium transition-all duration-200",
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
        </TabsContent>

        {/* 💰 One-Time content */}
        <TabsContent value="PURCHASE" className="w-full">
          <PricingGrid
            billingType="PURCHASE"
            dashboard={dashboard}
            plan={plan}
            featuresList={featuresList}
            getButtonText={getButtonText}
          />
        </TabsContent>
      </Tabs>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Pricing Grid + Card                            */
/* -------------------------------------------------------------------------- */

function PricingGrid({
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
  featuresList: Feature[]
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

function PricingCard({
  title,
  price,
  oldPrice,
  discount,
  features,
  buttonText,
  disabled,
  highlight,
}: {
  title: string
  price: string
  oldPrice?: string | null
  discount?: number | null
  features: string[]
  buttonText: string
  disabled?: boolean
  highlight?: boolean
}) {
  return (
    <Card
      className={cn(
        "w-[300px] rounded-2xl transition-all duration-200 hover:scale-[1.02]",
        highlight
          ? "bg-zinc-900 text-white border border-primary shadow-xl"
          : "bg-background"
      )}
    >
      <CardHeader className="text-center space-y-2">
        <CardTitle
          className={cn("text-2xl font-semibold", highlight && "text-white")}
        >
          {title}
        </CardTitle>

        <div className="flex flex-col items-center justify-center relative">
          {oldPrice && (
            <span
              className={cn(
                "text-gray-400 line-through text-lg",
                highlight && "text-gray-300/70"
              )}
            >
              {oldPrice}
            </span>
          )}
          <p
            className={cn(
              "text-3xl font-bold mt-1",
              highlight && "text-primary-foreground"
            )}
          >
            {price}
          </p>

          {discount && (
            <span
              className={cn(
                "absolute top-0 right-[-2] bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md",
                highlight && "bg-green-400 text-black"
              )}
            >
              Save {discount}%
            </span>
          )}
        </div>
      </CardHeader>

      <Separator className={cn("my-3", highlight && "bg-white/20")} />

      <CardContent>
        <ul className="text-sm space-y-2 text-left mx-auto max-w-xs">
          {features.map((f) => {
            // Define which features should show ❌ for Pro plan
            const featuresToShowCrossForPro = [
              "1 organization",
              "Up to 3 team member invitations",
            ]

            // Check if this feature should show ❌ for Pro plan
            const shouldShowCross =
              title === "Pro" &&
              featuresToShowCrossForPro.some((crossFeature) =>
                f.includes(crossFeature)
              )

            return (
              <li
                key={f}
                className={cn(
                  "flex items-center gap-2",
                  highlight
                    ? "text-gray-100"
                    : shouldShowCross
                      ? "text-red-500"
                      : "text-muted-foreground"
                )}
              >
                <span>{shouldShowCross ? "❌" : "✔️"}</span>
                <span>{f}</span>
              </li>
            )
          })}
        </ul>
      </CardContent>

      <CardFooter className="mt-6">
        <Button
          disabled={disabled}
          variant={highlight ? "secondary" : "default"}
          className={cn(
            "w-full font-medium",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
