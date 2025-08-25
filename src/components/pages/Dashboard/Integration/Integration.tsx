// app/components/ConnectStripeButton.tsx

"use client"

import React from "react"

export default function ConnectStripeButton() {
  const handleConnect = () => {
    // Redirect the seller to your backend route, which will redirect to Stripe
    window.location.href = "/api/stripe/connect"
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Connect Stripe Account
    </button>
  )
}
