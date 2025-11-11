"use client"

import { useEffect, useState } from "react"
import { initializePaddle, Paddle } from "@paddle/paddle-js"
import { paddleConfig } from "@/util/PaddleConfig"

type SubscriptionCycle = "MONTHLY" | "YEARLY"

type CheckoutParams =
  | {
      type: "PURCHASE"
      plan: "PRO" | "ULTIMATE"
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

  const openCheckout = (params: CheckoutParams) => {
    if (!paddle) {
      alert("Paddle not initialized yet.")
      return
    }

    let priceId: string | undefined

    if (params.type === "SUBSCRIPTION") {
      priceId = paddleConfig.priceIds.SUBSCRIPTION[params.cycle][params.plan]
    } else {
      priceId = paddleConfig.priceIds.PURCHASE[params.plan]
    }

    if (!priceId) {
      console.error(`❌ Missing price ID for ${params.type} → ${params.plan}`)
      return
    }

    paddle.Checkout.open({
      items: [{ priceId, quantity: params.quantity ?? 1 }],
      settings: {
        displayMode: "overlay",
        theme: "light",
      },
    })
  }

  return { openCheckout }
}
