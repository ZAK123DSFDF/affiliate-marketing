"use client"

import React from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader2, CopyIcon, KeyRound } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/Auth/FormFields"
import { Form } from "@/components/ui/form"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import {
  getOrgWebhookKey,
  savePaddleWebhookKey,
} from "@/app/(organization)/seller/[orgId]/dashboard/integration/action"

const webhookSchema = z.object({
  webhookKey: z.string().min(1, "Webhook key cannot be empty"),
})

type WebhookSchema = z.infer<typeof webhookSchema>

interface ConnectProps {
  WEBHOOK_URL: string
  copied: boolean
  handleCopy: () => void
  orgId: string
}

export default function Connect({
  WEBHOOK_URL,
  copied,
  handleCopy,
  orgId,
}: ConnectProps) {
  const { showCustomToast } = useCustomToast()

  const form = useForm<WebhookSchema>({
    resolver: zodResolver(webhookSchema),
    defaultValues: { webhookKey: "" },
  })

  const mutation = useMutation({
    mutationFn: async (key: string) => {
      return await savePaddleWebhookKey({ orgId, webhookPublicKey: key })
    },
    onSuccess: () => {
      showCustomToast({
        type: "success",
        title: "Connected",
        description: "Paddle webhook key saved successfully.",
        affiliate: false,
      })
      form.reset()
    },
    onError: (err: any) => {
      showCustomToast({
        type: "error",
        title: "Connection failed",
        description: err.message || "Something went wrong.",
        affiliate: false,
      })
    },
  })

  const onSubmit = (data: WebhookSchema) => {
    mutation.mutate(data.webhookKey)
  }
  const { data, isPending } = useQuery({
    queryKey: ["paddle-webhook-key", orgId],
    queryFn: async () => await getOrgWebhookKey(orgId),
  })

  const savedKey = data?.webhookPublicKey ?? ""

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Connect Paddle</h3>

      <Tabs defaultValue="step1" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="step1">Step 1</TabsTrigger>
          <TabsTrigger value="step2">Step 2</TabsTrigger>
          <TabsTrigger value="step3">Step 3</TabsTrigger>
          <TabsTrigger value="step4">Step 4</TabsTrigger>
        </TabsList>

        {/* STEP 1 */}
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

        {/* STEP 2 */}
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
                  Usage: <strong>Platform</strong> (or Platform and Simulation)
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

        {/* STEP 3 */}
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

        {/* STEP 4 */}
        <TabsContent value="step4">
          <Card>
            <CardHeader className="font-semibold">
              Copy Webhook Secret Key
            </CardHeader>
            <CardContent className="space-y-6">
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

              {/* Webhook Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <InputField
                    control={form.control}
                    name="webhookKey"
                    label="Webhook Public Key"
                    placeholder="Enter your Paddle Webhook Public Key"
                    type="text"
                    icon={KeyRound}
                    disabled={!!savedKey}
                    affiliate={false}
                  />

                  {savedKey ? (
                    <Button disabled className="w-full" variant="outline">
                      ✅ Connected
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
