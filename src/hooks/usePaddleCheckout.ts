"use client"

import { useEffect, useState } from "react"
import { initializePaddle, Paddle } from "@paddle/paddle-js"
import { paddleConfig } from "@/util/PaddleConfig"
import { PlanInfo } from "@/lib/types/planInfo"
import { getOrganizationToken } from "@/lib/server/getOrganizationToken" // 👈 assuming you already have this type

type SubscriptionCycle = "MONTHLY" | "YEARLY"

type CheckoutParams =
  | {
      type: "PURCHASE"
      plan: "PRO" | "ULTIMATE"
      currentPlan?: PlanInfo | null // 👈 add current plan info
      quantity?: number
    }
  | {
      type: "SUBSCRIPTION"
      plan: "PRO" | "ULTIMATE"
      cycle: SubscriptionCycle
      quantity?: number
    }

export function usePaddleCheckout() {
  const [paddle, setPaddle] = useState<Paddle>()

  useEffect(() => {
    initializePaddle({
      environment:
        process.env.NODE_ENV === "production" ? "production" : "sandbox",
      token: paddleConfig.token,
    }).then((instance) => setPaddle(instance))
  }, [])

  useEffect(() => {
    if (!paddle) return
    const handleCheckoutComplete = (event: any) => {
      if (event.name === "checkout.completed") {
        console.log("✅ Checkout completed:", event.data)
        paddle.Checkout.close()
      }
    }
    window.addEventListener("paddle-event", handleCheckoutComplete)
    return () =>
      window.removeEventListener("paddle-event", handleCheckoutComplete)
  }, [paddle])

  const openCheckout = async (params: CheckoutParams) => {
    if (!paddle) {
      alert("Paddle not initialized yet.")
      return
    }

    let priceId: string | undefined

    // 🧩 Special case: Upgrade from PRO → ULTIMATE one-time
    if (
      params.type === "PURCHASE" &&
      params.plan === "ULTIMATE" &&
      params.currentPlan?.type === "PURCHASE" &&
      params.currentPlan?.plan === "PRO"
    ) {
      priceId = paddleConfig.priceIds.PURCHASE.ULTIMATE_UPGRADE_FROM_PRO
    } else if (params.type === "SUBSCRIPTION") {
      priceId = paddleConfig.priceIds.SUBSCRIPTION[params.cycle][params.plan]
    } else {
      priceId = paddleConfig.priceIds.PURCHASE[params.plan]
    }

    if (!priceId) {
      console.error(`❌ Missing price ID for ${params.type} → ${params.plan}`)
      return
    }
    const organizationToken = await getOrganizationToken()
    paddle.Checkout.open({
      items: [{ priceId, quantity: params.quantity ?? 1 }],
      customData: {
        organizationToken,
      },
      settings: {
        displayMode: "overlay",
        theme: "light",
      },
    })
  }

  return { openCheckout }
}
