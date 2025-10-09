import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CopyIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
interface ConnectProps {
  WEBHOOK_URL: string
  copied: boolean
  webhookKey: string
  handleCopy: () => void
  handleWebhookKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const Connect = ({
  WEBHOOK_URL,
  copied,
  webhookKey,
  handleCopy,
  handleWebhookKeyChange,
}: ConnectProps) => {
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
  )
}
export default Connect
