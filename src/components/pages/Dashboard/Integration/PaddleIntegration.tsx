"use client"

import Image from "next/image"
import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyIcon } from "lucide-react"
import FrameworkInstructions from "@/components/pages/Dashboard/Integration/FrameworkInstructions"
import { CopyButton } from "@/components/ui/copy-button"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import {
  clientLabels,
  clientSnippets,
  serverLabels,
  serverSnippets,
} from "@/util/integration/paddle/Integration"
import Connect from "@/components/pages/Dashboard/Integration/Paddle/Connect"
import Disconnect from "@/components/pages/Dashboard/Integration/Paddle/Disconnect"
import EmbedCheckout from "@/components/pages/Dashboard/Integration/Paddle/EmbedCheckout"

const WEBHOOK_URL = "https://yourdomain.com/api/webhooks/paddle"

export default function PaddleIntegration() {
  const [copied, setCopied] = useState(false)
  const [webhookKey, setWebhookKey] = useState("")

  const handleCopy = () => {
    navigator.clipboard.writeText(WEBHOOK_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWebhookKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setWebhookKey(value)
    console.log("Paddle Webhook Public Key:", value)
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
            webhookKey={webhookKey}
            handleCopy={handleCopy}
            handleWebhookKeyChange={handleWebhookKeyChange}
          />
        </TabsContent>

        {/* DISCONNECT PADDLE */}
        <TabsContent value="disconnect">
          <Disconnect />
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
