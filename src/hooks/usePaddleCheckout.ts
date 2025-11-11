"use client"

import { useEffect, useState } from "react"
import { initializePaddle, Paddle } from "@paddle/paddle-js"
import { paddlePriceIds } from "@/util/PaddlePriceIds"

type CheckoutParams = {
  type: "SUBSCRIPTION" | "PURCHASE"
  plan: "PRO" | "ULTIMATE"
  quantity?: number
}

export function usePaddleCheckout() {
  const [paddle, setPaddle] = useState<Paddle>()

  useEffect(() => {
    initializePaddle({
      environment:
        process.env.NODE_ENV === "production" ? "production" : "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((instance) => setPaddle(instance))
  }, [])

  // 🧠 Listen globally for checkout completion events
  useEffect(() => {
    if (!paddle) return

    const handleCheckoutComplete = (event: any) => {
      if (event.name === "checkout.completed") {
        console.log("✅ Checkout completed:", event.data)
        paddle.Checkout.close()
      }
    }

    window.addEventListener("paddle-event", handleCheckoutComplete)

    return () => {
      window.removeEventListener("paddle-event", handleCheckoutComplete)
    }
  }, [paddle])

  const openCheckout = ({ type, plan, quantity = 1 }: CheckoutParams) => {
    if (!paddle) {
      alert("Paddle not initialized yet.")
      return
    }

    const priceId = paddlePriceIds[type][plan]
    if (!priceId) {
      console.error(`Missing price ID for ${type} → ${plan}`)
      return
    }

    paddle.Checkout.open({
      items: [{ priceId, quantity }],
      settings: {
        displayMode: "overlay",
        theme: "light",
      },
    })
  }

  return { openCheckout }
}
