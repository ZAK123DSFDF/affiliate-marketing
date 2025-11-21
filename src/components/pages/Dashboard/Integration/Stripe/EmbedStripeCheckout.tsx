"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton } from "@/components/ui/copy-button"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const EmbedStripeCheckout = () => {
  const snippets = {
    Nextjs_serverAction: `// Next.js Server Action (App Router)
/app/actions/stripe/createCheckoutSession.ts

"use server";
import Stripe from "stripe";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function createCheckoutSession() {
  const cookieStore = await cookies();
  const affiliateCookie = cookieStore.get("refearnapp_affiliate_cookie");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{ price: "price_xxx", quantity: 1 }],
    success_url: "https://your-site.com/success",
    cancel_url: "https://your-site.com/cancel",
    metadata: {
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
        : null,
    },
  });

  return { url: session.url };
}`,
    Nextjs_apiRoutes: `// Next.js Route Handler Example (App Router)
import Stripe from "stripe";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST() {
  const cookieStore = cookies();
  const affiliate = cookieStore.get("refearnapp_affiliate_cookie");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: "price_xxx", quantity: 1 }],
    success_url: "https://your-site.com/success",
    cancel_url: "https://your-site.com/cancel",
    metadata: {
      refearnapp_affiliate_code: affiliate
        ? decodeURIComponent(affiliate.value)
        : null,
    },
  });

  return Response.json({ url: session.url });
}`,
    express: `// Express Server Example
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/api/checkout", async (req, res) => {
  const affiliate = req.cookies["refearnapp_affiliate_cookie"];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: "price_xxx", quantity: 1 }],
    success_url: "https://your-site.com/success",
    cancel_url: "https://your-site.com/cancel",
    metadata: {
      refearnapp_affiliate_code: affiliate
        ? decodeURIComponent(affiliate)
        : null,
    },
  });

  res.json({ url: session.url });
});`,
    sveltekit: `// SvelteKit Endpoint Example (+server.ts)
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST({ cookies }) {
  const affiliate = cookies.get("refearnapp_affiliate_cookie");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: "price_xxx", quantity: 1 }],
    success_url: "https://your-site.com/success",
    cancel_url: "https://your-site.com/cancel",
    metadata: {
      refearnapp_affiliate_code: affiliate
        ? decodeURIComponent(affiliate)
        : null,
    },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { "Content-Type": "application/json" },
  });
}`,
    nuxt: `// Nuxt Server Route Example (server/api/checkout.post.ts)
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export default defineEventHandler(async (event) => {
  const affiliate = getCookie(event, "refearnapp_affiliate_cookie");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: "price_xxx", quantity: 1 }],
    success_url: "https://your-site.com/success",
    cancel_url: "https://your-site.com/cancel",
    metadata: {
      refearnapp_affiliate_code: affiliate
        ? decodeURIComponent(affiliate)
        : null,
    },
  });

  return { url: session.url };
});`,
  }

  const labels = {
    Nextjs_serverAction: "Next.js Server Action",
    Nextjs_apiRoutes: "Next.js API Routes",
    express: "Express",
    sveltekit: "SvelteKit",
    nuxt: "Nuxt",
  }

  const snippetKeys = Object.keys(snippets) as Array<keyof typeof snippets>
  const [value, setValue] = React.useState(snippetKeys[0])

  return (
    <Card className="p-6 space-y-4">
      <h4 className="text-lg font-semibold">
        Embed Affiliate Code in Checkout
      </h4>
      <p className="text-muted-foreground">
        Pass the affiliate code in metadata when redirecting users to Stripe
        Checkout.
      </p>

      <Tabs
        value={value}
        onValueChange={(val) => setValue(val as keyof typeof snippets)}
        className="w-full"
      >
        {/* 📱 MOBILE SELECT (shadcn) */}
        <div className="xl:hidden mb-4">
          <Select
            value={value}
            onValueChange={(val) => setValue(val as keyof typeof snippets)}
          >
            <SelectTrigger affiliate={false} className="w-full">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>

            <SelectContent affiliate={false}>
              {snippetKeys.map((key) => (
                <SelectItem affiliate={false} key={key} value={key}>
                  {labels[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 💻 DESKTOP TABS */}
        <TabsList className="hidden xl:flex w-full gap-3 p-2">
          {snippetKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="flex-1 text-center">
              {labels[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        {snippetKeys.map((key) => (
          <TabsContent key={key} value={key}>
            <Card className="relative overflow-hidden">
              <CopyButton
                value={snippets[key]}
                className="absolute top-2 right-2 z-10 text-white"
              />
              <SyntaxHighlighter
                language="ts"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  fontSize: "0.875rem",
                  backgroundColor: "#1e1e1e",
                  borderRadius: "0.75rem",
                  whiteSpace: "pre",
                }}
              >
                {snippets[key]}
              </SyntaxHighlighter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}

export default EmbedStripeCheckout
