"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FrameworkInstructions from "@/components/pages/Dashboard/Integration/FrameworkInstructions"
import Connect from "@/components/pages/Dashboard/Integration/Paddle/Connect"
import Disconnect from "@/components/pages/Dashboard/Integration/Paddle/Disconnect"
import EmbedCheckout from "@/components/pages/Dashboard/Integration/Paddle/EmbedCheckout"

const WEBHOOK_URL = "https://yourdomain.com/api/webhooks/paddle"

export default function PaddleIntegration({ orgId }: { orgId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard
      .writeText(WEBHOOK_URL)
      .then(() => console.log("Webhook URL copied to clipboard"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="space-y-10">
      <Tabs defaultValue="connect" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="disconnect">Disconnect</TabsTrigger>
          <TabsTrigger value="embedScript">Embed Script</TabsTrigger>
          <TabsTrigger value="embedCheckout">Embed Checkout</TabsTrigger>
        </TabsList>

        {/* CONNECT PADDLE */}
        <TabsContent value="connect">
          <Connect
            WEBHOOK_URL={WEBHOOK_URL}
            copied={copied}
            handleCopy={handleCopy}
            orgId={orgId}
          />
        </TabsContent>

        {/* DISCONNECT PADDLE */}
        <TabsContent value="disconnect">
          <Disconnect orgId={orgId} />
        </TabsContent>

        {/* EMBED SCRIPT */}
        <TabsContent value="embedScript">
          <h3 className="text-xl font-semibold mb-4">Embed Script</h3>
          <FrameworkInstructions />
        </TabsContent>

        {/* EMBED CHECKOUT */}
        <TabsContent value="embedCheckout">
          <EmbedCheckout />
        </TabsContent>
      </Tabs>
    </div>
  )
}
