import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  clientLabels,
  clientSnippets,
  serverLabels,
  serverSnippets,
} from "@/util/integration/paddle/Integration"
import { Card } from "@/components/ui/card"
import { CopyButton } from "@/components/ui/copy-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

const EmbedCheckout = () => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-2">
        Embed Affiliate Code in Checkout
      </h3>
      <p className="text-muted-foreground">
        To pass the affiliate code to Paddle Checkout, use the following code
        snippet in your server-side checkout logic:
      </p>
      <Tabs defaultValue="server" className="w-full mt-4">
        <TabsList className="mb-2">
          <TabsTrigger value="server">Server Integration</TabsTrigger>
          <TabsTrigger value="client">Client Integration</TabsTrigger>
        </TabsList>

        {/* Server */}
        <TabsContent value="server">
          <Tabs defaultValue="Nextjs_serverAction">
            <TabsList className="grid grid-cols-4 w-full">
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
                  </ScrollArea>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Client */}
        <TabsContent value="client">
          <Tabs defaultValue="react">
            <TabsList className="grid grid-cols-4 w-full">
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
                  </ScrollArea>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </>
  )
}
export default EmbedCheckout
