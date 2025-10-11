"use client"

import React, { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import FrameworkInstructions from "@/components/pages/Dashboard/Integration/FrameworkInstructions"
import EmbedStripeCheckout from "@/components/pages/Dashboard/Integration/Stripe/EmbedStripeCheckout"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"

export default function StripeIntegration({ orgId }: { orgId: string }) {
  const queryClient = useQueryClient()
  const { showCustomToast } = useCustomToast()
  // ✅ Fetch connection status
  const { data, error, isPending } = useQuery({
    queryKey: ["stripeStatus", orgId],
    queryFn: async () => {
      const res = await fetch("/api/stripe/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok)
        throw new Error(data.error || "Failed to fetch Stripe status")
      return data
    },
  })

  useEffect(() => {
    if (error) {
      showCustomToast({
        type: "error",
        title: "Failed to Load Stripe Status",
        description:
          (error as Error)?.message ||
          "Something went wrong while checking Stripe status.",
        affiliate: false,
      })
    }
  }, [error])
  // ✅ Connect Mutation
  const connectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to connect Stripe")
      return data
    },
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (error: any) => {
      showCustomToast({
        type: "error",
        title: "Connection Failed",
        description:
          error?.message || "Something went wrong while connecting Stripe.",
        affiliate: false,
      })
    },
  })

  // ✅ Disconnect Mutation
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/stripe/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to disconnect Stripe")
      return data
    },
    onSuccess: () => {
      showCustomToast({
        type: "success",
        title: "Disconnected Successfully",
        description: "Your Stripe account has been disconnected.",
        affiliate: false,
      })
      queryClient
        .invalidateQueries({ queryKey: ["stripeStatus", orgId] })
        .then(() => console.log("invalidated"))
    },
    onError: (error: any) => {
      showCustomToast({
        type: "error",
        title: "Disconnect Failed",
        description:
          error?.message || "Something went wrong while disconnecting Stripe.",
        affiliate: false,
      })
    },
  })

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Stripe Integration</h3>
      <Tabs defaultValue="connect" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="disconnect">Disconnect</TabsTrigger>
          <TabsTrigger value="embed-script">Embed Script</TabsTrigger>
          <TabsTrigger value="embed-checkout">Embed Checkout</TabsTrigger>
        </TabsList>

        {/* CONNECT */}
        <TabsContent value="connect">
          <Card className="p-6 space-y-4">
            <h4 className="text-lg font-semibold">
              Connect Your Stripe Account
            </h4>
            {data?.connected ? (
              <p className="text-green-600 font-medium">
                ✅ Connected as {data.email || "Unknown Email"}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Connect your verified Stripe account to start handling payouts.
              </p>
            )}
            <Button
              onClick={() => connectMutation.mutate()}
              disabled={
                data?.connected || connectMutation.isPending || isPending
              }
            >
              {connectMutation.isPending
                ? "Redirecting..."
                : data?.connected
                  ? "Already Connected"
                  : "Connect Stripe"}
            </Button>
          </Card>
        </TabsContent>

        {/* DISCONNECT */}
        <TabsContent value="disconnect">
          <Card className="p-6 space-y-4">
            <h4 className="text-lg font-semibold">Disconnect Stripe Account</h4>
            <p className="text-muted-foreground">
              Click below to disconnect your Stripe account.
            </p>
            <Button
              onClick={() => disconnectMutation.mutate()}
              variant="destructive"
              disabled={!data?.connected || disconnectMutation.isPending}
            >
              {disconnectMutation.isPending
                ? "Disconnecting..."
                : "Disconnect Stripe"}
            </Button>
          </Card>
        </TabsContent>

        {/* EMBED SCRIPT */}
        <TabsContent value="embed-script">
          <Card className="p-6 space-y-4">
            <h4 className="text-lg font-semibold">Embed the Tracking Script</h4>
            <p className="text-muted-foreground">
              After connecting, embed the following script for tracking.
            </p>
            <FrameworkInstructions />
          </Card>
        </TabsContent>

        {/* EMBED CHECKOUT */}
        <TabsContent value="embed-checkout">
          <EmbedStripeCheckout />
        </TabsContent>
      </Tabs>
    </div>
  )
}
