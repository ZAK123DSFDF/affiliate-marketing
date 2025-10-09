"use client"

import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyButton } from "@/components/ui/copy-button"
import FrameworkInstructions from "@/components/pages/Dashboard/Integration/FrameworkInstructions"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import EmbedStripeCheckout from "@/components/pages/Dashboard/Integration/Stripe/EmbedStripeCheckout"

export default function StripeIntegration() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    fetch("/api/stripe/status")
      .then((res) => res.json())
      .then((data) => setConnected(data.connected))
  }, [])

  const handleConnect = () => {
    window.location.href = "/api/stripe/connect"
  }

  const handleDisconnect = async () => {
    await fetch("/api/stripe/disconnect", {
      method: "POST",
      body: JSON.stringify({ stripeAccountId: "your_account_id_here" }),
    })
    setConnected(false)
  }
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

        {/* CONNECT TAB */}
        <TabsContent value="connect">
          <Card className="p-6 space-y-4">
            <h4 className="text-lg font-semibold">
              Connect Your Stripe Account
            </h4>
            <p className="text-muted-foreground">
              Connect your verified Stripe account to start handling payouts and
              receiving webhook events securely.
            </p>
            <Button onClick={handleConnect}>Connect Stripe</Button>
          </Card>
        </TabsContent>

        {/* DISCONNECT TAB */}
        <TabsContent value="disconnect">
          <Card className="p-6 space-y-4">
            <h4 className="text-lg font-semibold">Disconnect Stripe Account</h4>
            <p className="text-muted-foreground">
              If you want to disconnect your Stripe account, click the button
              below. This will remove your integration, but you can reconnect
              anytime.
            </p>
            <Button onClick={handleDisconnect} variant="destructive">
              Disconnect Stripe
            </Button>
          </Card>
        </TabsContent>

        {/* EMBED SCRIPT TAB */}
        <TabsContent value="embed-script">
          <Card className="p-6 space-y-4">
            <h4 className="text-lg font-semibold">Embed the Tracking Script</h4>
            <p className="text-muted-foreground">
              After connecting, embed the following script into your website to
              enable affiliate tracking. Choose your framework below.
            </p>
            <FrameworkInstructions />
          </Card>
        </TabsContent>

        {/* EMBED CHECKOUT TAB */}
        <TabsContent value="embed-checkout">
          <EmbedStripeCheckout />
        </TabsContent>
      </Tabs>
    </div>
  )
}
