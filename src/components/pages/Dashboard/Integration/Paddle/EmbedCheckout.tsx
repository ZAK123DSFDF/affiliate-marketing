import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  clientLabels,
  clientSnippets,
  serverLabels,
  serverSnippets,
} from "@/util/integration/paddle/Integration"
import { CopyButton } from "@/components/ui/copy-button"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

const EmbedCheckout = () => {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold mb-2">
        Embed Affiliate Code in Checkout
      </h3>
      <p className="text-muted-foreground">
        To pass the affiliate code to Paddle Checkout, use the following code
        snippet in your server-side checkout logic:
      </p>
      <Tabs defaultValue="server" className="w-full mt-4">
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full gap-2 mb-4 h-auto">
          <TabsTrigger value="server">Server Integration</TabsTrigger>
          <TabsTrigger value="client">Client Integration</TabsTrigger>
        </TabsList>

        {/* Server */}
        <TabsContent value="server">
          <ServerIntegration />
        </TabsContent>

        {/* Client */}
        <TabsContent value="client">
          <ClientIntegration />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
export default EmbedCheckout
function ServerIntegration() {
  const keys = Object.keys(serverSnippets)
  const [value, setValue] = React.useState(keys[0])

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full">
      {/* 📱 MOBILE SELECT */}
      <div className="xl:hidden mb-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger affiliate={false} className="w-full">
            <SelectValue placeholder="Select server framework" />
          </SelectTrigger>

          <SelectContent affiliate={false}>
            {keys.map((key) => (
              <SelectItem affiliate={false} key={key} value={key}>
                {serverLabels[key as keyof typeof serverLabels] ?? key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 💻 DESKTOP TABS */}
      <TabsList className="hidden xl:grid xl:grid-cols-5 w-full h-auto gap-3 p-2">
        {keys.map((key) => (
          <TabsTrigger key={key} value={key}>
            {serverLabels[key as keyof typeof serverLabels] ?? key}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* CONTENT */}
      {Object.entries(serverSnippets).map(([key, code]) => (
        <TabsContent key={key} value={key} className="relative">
          <CopyButton
            value={code}
            className="absolute top-2 right-2 z-10 text-white"
          />
          <SyntaxHighlighter
            language="ts"
            style={vscDarkPlus}
            wrapLongLines
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
        </TabsContent>
      ))}
    </Tabs>
  )
}
function ClientIntegration() {
  const keys = Object.keys(clientSnippets)
  const [value, setValue] = React.useState(keys[0])

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full">
      {/* 📱 MOBILE SELECT */}
      <div className="lg:hidden mb-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger affiliate={false} className="w-full">
            <SelectValue placeholder="Select client framework" />
          </SelectTrigger>

          <SelectContent affiliate={false}>
            {keys.map((key) => (
              <SelectItem affiliate={false} key={key} value={key}>
                {clientLabels[key as keyof typeof clientLabels] ?? key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 💻 DESKTOP TABS */}
      <TabsList className="hidden lg:grid lg:grid-cols-5 w-full h-auto gap-3 p-2">
        {keys.map((key) => (
          <TabsTrigger key={key} value={key}>
            {clientLabels[key as keyof typeof clientLabels] ?? key}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(clientSnippets).map(([key, code]) => (
        <TabsContent key={key} value={key} className="relative">
          <CopyButton
            value={code}
            className="absolute top-2 right-2 z-10 text-white"
          />
          <SyntaxHighlighter
            language="ts"
            style={vscDarkPlus}
            wrapLongLines
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
        </TabsContent>
      ))}
    </Tabs>
  )
}
