"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CopyButton } from "@/components/ui/copy-button"
import { Card } from "@/components/ui/card"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const scriptUrl =
  "https://affiliate-marketing-ten.vercel.app/affiliateTrackingJavascript.js"

const frameworks = [
  {
    name: "Next.js",
    description:
      "Place the script using the built-in `next/script` component, typically in your `_app.tsx` or a layout component.",
    code: `<Script src="${scriptUrl}" />`,
    language: "tsx",
  },
  {
    name: "React",
    description:
      'Insert this inside your main HTML template (e.g. in "public/index.html" if using CRA).',
    code: `<script src="${scriptUrl}"></script>`,
    language: "html",
  },
  {
    name: "Vue",
    description:
      'Add the script to your "public/index.html" file before the closing </body> tag.',
    code: `<script src="${scriptUrl}"></script>`,
    language: "html",
  },
  {
    name: "Svelte / SvelteKit",
    description:
      'Place this in the HTML template (e.g. "app.html" or "__layout.svelte" depending on your setup).',
    code: `<script src="${scriptUrl}"></script>`,
    language: "html",
  },
]

export default function FrameworkInstructions() {
  const [value, setValue] = React.useState("Next.js")

  return (
    <div className="mt-8 space-y-6 text-left">
      <p className="text-muted-foreground">
        Copy and paste the following code snippet into the appropriate location
        in your project depending on your framework:
      </p>

      <Tabs value={value} onValueChange={setValue} className="w-full">
        {/* 📱 MOBILE SELECT */}
        <div className="lg:hidden mb-4">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger affiliate={false} className="w-full">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>

            <SelectContent affiliate={false}>
              {frameworks.map((fw) => (
                <SelectItem affiliate={false} key={fw.name} value={fw.name}>
                  {fw.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 💻 DESKTOP TABS */}
        <TabsList className="hidden lg:grid lg:grid-cols-4 w-full h-auto gap-3 p-2">
          {frameworks.map((fw) => (
            <TabsTrigger key={fw.name} value={fw.name}>
              {fw.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* CONTENT */}
        {frameworks.map((fw) => (
          <TabsContent key={fw.name} value={fw.name} className="pt-4">
            <p className="mb-2 text-sm text-muted-foreground">
              {fw.description}
            </p>

            <Card className="relative w-full p-0 overflow-hidden rounded-xl">
              <CopyButton
                className="absolute top-2 right-2 z-10 text-white"
                value={fw.code}
              />
              <SyntaxHighlighter
                language={fw.language}
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
                  maxWidth: "100%",
                  overflowX: "auto",
                }}
              >
                {fw.code}
              </SyntaxHighlighter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
