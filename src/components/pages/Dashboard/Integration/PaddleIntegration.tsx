"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyIcon } from "lucide-react";
import FrameworkInstructions from "@/components/pages/Dashboard/Integration/FrameworkInstructions";
import { CopyButton } from "@/components/ui/copy-button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  clientLabels,
  clientSnippets,
  serverLabels,
  serverSnippets,
} from "@/util/integration/paddle/Integration";

const WEBHOOK_URL = "https://yourdomain.com/api/webhooks/paddle";

export default function PaddleIntegration() {
  const [copied, setCopied] = useState(false);
  const [webhookKey, setWebhookKey] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWebhookKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setWebhookKey(value);
    console.log("Paddle Webhook Public Key:", value);
  };

  return (
    <div className="space-y-10">
      {/* 1. Connect Paddle */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          1. Connect Paddle to Your Account
        </h3>

        <Tabs defaultValue="step1" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="step1">Step 1</TabsTrigger>
            <TabsTrigger value="step2">Step 2</TabsTrigger>
            <TabsTrigger value="step3">Step 3</TabsTrigger>
            <TabsTrigger value="step4">Step 4</TabsTrigger>
          </TabsList>

          {/* Step 1 */}
          <TabsContent value="step1">
            <Card>
              <CardHeader className="font-semibold">
                Go to Paddle Dashboard
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Login to your Paddle seller account, then navigate to:
                  <br />
                  <strong>Developer Tools → Notifications</strong>
                </p>
                <Image
                  src="/images/paddle/paddle-1.png"
                  alt="Paddle Notifications Settings"
                  width={800}
                  height={400}
                  className="rounded-xl border"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2 */}
          <TabsContent value="step2">
            <Card>
              <CardHeader className="font-semibold">
                Create Webhook Destination
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Click <strong>New destination</strong> and choose:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>
                    Type: <strong>Webhook</strong>
                  </li>
                  <li>
                    Usage: <strong>Platform</strong> (or Simulation)
                  </li>
                </ul>
                <Image
                  src="/images/paddle/paddle-2.png"
                  alt="Create Destination"
                  width={800}
                  height={400}
                  className="rounded-xl border"
                />
                <p>
                  Then paste the following webhook URL into the destination URL
                  field:
                </p>
                <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-md border w-fit space-x-2">
                  <ScrollArea className="max-w-[400px] whitespace-nowrap text-sm">
                    {WEBHOOK_URL}
                  </ScrollArea>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                    className="ml-2"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
                {copied && (
                  <span className="text-xs text-green-600">Copied!</span>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3 */}
          <TabsContent value="step3">
            <Card>
              <CardHeader className="font-semibold">
                Select Events and Save
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Choose the events you want to listen to:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>
                    <code>transaction.completed</code>
                  </li>
                  <li>
                    <code>subscription.created</code>
                  </li>
                </ul>
                <p>
                  Then click <strong>Save</strong> to finish the setup.
                </p>
                <Image
                  src="/images/paddle/paddle-3.png"
                  alt="Select Events"
                  width={800}
                  height={400}
                  className="rounded-xl border"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4 */}
          <TabsContent value="step4">
            <Card>
              <CardHeader className="font-semibold">
                Copy Webhook Secret Key
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  After saving, click on the destination you just created, then
                  click <strong>Edit</strong>. Scroll down and click{" "}
                  <strong>Copy Secret Key</strong>.
                </p>
                <Image
                  src="/images/paddle/paddle-4.png"
                  alt="Copy Secret Key"
                  width={800}
                  height={400}
                  className="rounded-xl border"
                />
                <p>Paste the copied Webhook Public Key below:</p>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Paste your Paddle Webhook Public Key..."
                    value={webhookKey}
                    onChange={handleWebhookKeyChange}
                  />
                  <Button
                    onClick={() =>
                      console.log("Submitted Paddle Public Key:", webhookKey)
                    }
                  >
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 2. Disconnect Paddle */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">2. Disconnect Paddle</h3>
        <Card>
          <CardHeader className="font-semibold">
            Remove Webhook Connection
          </CardHeader>
          <CardContent className="space-y-4">
            <p>To stop sending data to our platform:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>
                Go to <strong>Developer Tools → Notifications</strong>.
              </li>
              <li>Find the destination you previously connected.</li>
              <li>
                Click the <strong>⋮</strong> (three-dot menu) on the right.
              </li>
              <li>
                Select <strong>Deactivate</strong>.
              </li>
            </ul>
            <Image
              src="/images/paddle/paddle-5.png"
              alt="Deactivate Paddle Webhook"
              width={800}
              height={400}
              className="rounded-xl border"
            />
            <p className="text-muted-foreground text-sm">
              Once deactivated, Paddle will no longer send data to our servers.
              You can reconnect anytime by following steps 1–4 above.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Embed the Script */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">3. Embed the Script</h3>
        <FrameworkInstructions />
      </div>
      {/* 4. Embed Affiliate Code */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          4. Embed Affiliate Code in Checkout
        </h3>
        <p className="text-muted-foreground">
          To pass the affiliate code to Paddle Checkout, use the following code
          snippet in your server-side checkout logic:
        </p>
        <Tabs defaultValue="server" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="server">Server Integration</TabsTrigger>
            <TabsTrigger value="client">Client Integration</TabsTrigger>
          </TabsList>
          <TabsContent value="server">
            <Tabs defaultValue="Nextjs_apiRoutes">
              <TabsList className="mb-2 overflow-x-auto">
                {Object.keys(serverSnippets).map((key) => (
                  <TabsTrigger key={key} value={key}>
                    {serverLabels[key as keyof typeof serverLabels] ?? key}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(serverSnippets).map(([key, code]) => (
                <TabsContent key={key} value={key} className="relative">
                  <Card className="relative overflow-hidden">
                    <CopyButton
                      value={code}
                      className="absolute top-2 right-2 z-10 text-white"
                    />
                    <ScrollArea className="max-h-[500px] overflow-y-auto">
                      <SyntaxHighlighter
                        language="ts"
                        style={vscDarkPlus}
                        wrapLongLines={true}
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.875rem",
                          backgroundColor: "#1e1e1e",
                          borderRadius: "0.75rem",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </ScrollArea>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="client">
            <Tabs defaultValue="react">
              <TabsList className="mb-2 overflow-x-auto">
                {Object.keys(clientSnippets).map((key) => (
                  <TabsTrigger key={key} value={key}>
                    {clientLabels[key as keyof typeof clientLabels] ?? key}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(clientSnippets).map(([key, code]) => (
                <TabsContent key={key} value={key} className="relative">
                  <Card className="relative overflow-hidden">
                    <CopyButton
                      value={code}
                      className="absolute top-2 right-2 z-10 text-white"
                    />
                    <ScrollArea className="max-h-[500px] overflow-y-auto">
                      <SyntaxHighlighter
                        language="ts"
                        style={vscDarkPlus}
                        wrapLongLines={true}
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.875rem",
                          backgroundColor: "#1e1e1e",
                          borderRadius: "0.75rem",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </ScrollArea>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
