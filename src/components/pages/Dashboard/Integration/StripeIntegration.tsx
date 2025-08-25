"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import FrameworkInstructions from "@/components/pages/Dashboard/Integration/FrameworkInstructions"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyButton } from "@/components/ui/copy-button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

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
  const cookieStore =await cookies();
  const affiliateCookie = cookieStore.get("refearnapp_affiliate_cookie");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price: "price_xxx",
        quantity: 1,
      },
    ],
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
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
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
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
        : null,
    },
  });

  res.json({ url: session.url });
});`,

    sveltekit: `// SvelteKit Endpoint Example (+server.ts)
import Stripe from "stripe";
import { cookies } from "@sveltejs/kit";

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
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
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
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
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
  return (
    <div className="space-y-10">
      {/* STEP 1 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          1. Connect your Stripe account
        </h2>
        <p className="text-muted-foreground mb-4">
          To begin using Stripe for handling payouts, you must connect your
          verified Stripe account. Once connected, you will be able to manage
          payouts and receive webhook events.
        </p>
        <div className="space-x-2">
          <Button onClick={handleConnect} disabled={connected}>
            Connect Stripe
          </Button>
          <Button
            onClick={handleDisconnect}
            disabled={!connected}
            variant="destructive"
          >
            Disconnect
          </Button>
        </div>
      </section>

      {/* STEP 2 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          2. Embed the tracking script
        </h2>
        <p className="text-muted-foreground mb-4">
          After connecting, embed the following script in your website to enable
          affiliate tracking. Choose your framework tab below and follow the
          instructions.
        </p>
        <FrameworkInstructions />
      </section>

      {/* STEP 3 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          3. Embed affiliate code into Stripe Checkout
        </h2>
        <p className="text-muted-foreground mb-4">
          When redirecting users to Stripe Checkout, make sure to pass the
          affiliate code via metadata. This allows us to track commissions based
          on the original referral cookie.
        </p>

        <Tabs defaultValue="Nextjs_serverAction" className="w-full">
          <TabsList className="mb-2 overflow-x-auto">
            {Object.keys(snippets).map((key) => (
              <TabsTrigger key={key} value={key}>
                {labels[key as keyof typeof labels] ?? key}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(snippets).map(([key, code]) => (
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
      </section>
    </div>
  )
}
