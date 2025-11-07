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

  // ✅ Differentiators moved to bottom
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

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as BillingType)}
        className="w-full flex flex-col items-center"
      >
        <TabsList className="flex justify-center gap-x-3 px-4 mb-8 py-6 bg-gray-200 rounded-xl">
          <TabsTrigger
            value="PURCHASE"
            className="px-4 py-2 text-sm flex items-center gap-2"
          >
            One-Time{" "}
            <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-md">
              Special Offer
            </span>
          </TabsTrigger>
          <TabsTrigger value="SUBSCRIPTION" className="px-4 py-2 text-sm">
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="SUBSCRIPTION" className="w-full">
          <PricingGrid
            billingType="SUBSCRIPTION"
            dashboard={dashboard}
            plan={plan}
            featuresList={featuresList}
            getButtonText={getButtonText}
          />
        </TabsContent>

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

function PricingGrid({
  billingType,
  dashboard,
  plan,
  featuresList,
  getButtonText,
}: {
  billingType: BillingType
  dashboard: boolean
  plan?: PlanInfo | null
  featuresList: Feature[]
  getButtonText: (p: PlanInfo["plan"]) => string
}) {
  const getPrice = (tier: PlanInfo["plan"]) => {
    if (tier === "FREE") return "$0"
    if (tier === "PRO")
      return billingType === "SUBSCRIPTION" ? "$25 / month" : "$85 one-time"
    if (tier === "ULTIMATE")
      return billingType === "SUBSCRIPTION" ? "$40 / month" : "$125 one-time"
    return "-"
  }

  const getOldPrice = (tier: PlanInfo["plan"]) => {
    if (tier === "FREE") return null

    if (billingType === "SUBSCRIPTION") {
      if (tier === "PRO") return "$35 / month"
      if (tier === "ULTIMATE") return "$55 / month"
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
          oldPrice={getOldPrice("FREE")}
          features={[
            "Basic features",
            "1 organization",
            "No team member invitations",
          ]}
          current={plan?.plan === "FREE"}
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
        current={plan?.plan === "PRO"}
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
        current={plan?.plan === "ULTIMATE"}
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
  current,
  buttonText,
  disabled,
  highlight,
}: {
  title: string
  price: string
  oldPrice?: string | null
  discount?: number | null
  features: string[]
  current?: boolean
  buttonText: string
  disabled?: boolean
  highlight?: boolean
}) {
  return (
    <Card
      className={cn(
        "w-[300px] rounded-2xl transition-all duration-200",
        highlight
          ? "bg-zinc-900 text-white border border-primary scale-105 shadow-xl"
          : "bg-background"
      )}
    >
      <CardHeader className="text-center space-y-2">
        <CardTitle
          className={cn("text-2xl font-semibold", highlight && "text-white")}
        >
          {title}
        </CardTitle>

        {/* 💸 Price Section */}
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
                // ✅ moved closer to the center
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
            const isDiffFeature =
              f.includes("organization") ||
              f.includes("team member invitations")

            return (
              <li
                key={f}
                className={cn(
                  "flex items-center gap-2",
                  highlight ? "text-gray-100" : "text-muted-foreground",
                  isDiffFeature && "font-semibold mt-3 pt-2"
                )}
              >
                {isDiffFeature ? (
                  highlight ? (
                    <span className="text-green-400">✔️</span>
                  ) : (
                    <span className="text-red-500">❌</span>
                  )
                ) : (
                  <span>✔️</span>
                )}
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
