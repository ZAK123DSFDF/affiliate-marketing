export const clientSnippets = {
  react: `import { initializePaddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

export default function Checkout() {
  const [paddle, setPaddle] = useState(null);
  
  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    }).then(setPaddle);
  }, []);
   function getCookie(name: string): string | null {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)"),
    );
    return match ? decodeURIComponent(match[2]) : null;
  }
  const handleCheckout = () => {
    if (!paddle) return;
    paddle.Checkout.open({
      items: [{ priceId: "pri_XXX", quantity: 1 }],
      customData: {
        refearnapp_affiliate_code: getCookie("refearnapp_affiliate_cookie"),
      },
      settings: {
        displayMode: "overlay",
        theme: "light",
        successUrl: "https://yoursite.com/success",
      },
    });
  };
}`,
  vue: `<!-- Vue 3 Composition API -->
<script setup>
import { ref, onMounted } from 'vue';
import { initializePaddle } from '@paddle/paddle-js';

const paddle = ref(null);

onMounted(async () => {
  paddle.value = await initializePaddle({
    environment: 'sandbox',
    token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
  });
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function handleCheckout() {
  if (!paddle.value) return;
  paddle.value.Checkout.open({
    items: [{ priceId: 'pri_XXX', quantity: 1 }],
    customData: {
      refearnapp_affiliate_code: getCookie('refearnapp_affiliate_cookie'),
    },
    settings: {
      displayMode: 'overlay',
      theme: 'light',
      successUrl: 'https://yoursite.com/success',
    },
  });
}
</script>
`,

  nuxt: `<!-- Nuxt 3 Client-Side Example -->
<script setup>
import { onMounted, ref } from 'vue';
import { initializePaddle } from '@paddle/paddle-js';

const paddle = ref(null);

onMounted(async () => {
  paddle.value = await initializePaddle({
    environment: 'sandbox',
    token: useRuntimeConfig().public.paddleClientToken,
  });
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function handleCheckout() {
  if (!paddle.value) return;
  paddle.value.Checkout.open({
    items: [{ priceId: 'pri_XXX', quantity: 1 }],
    customData: {
      refearnapp_affiliate_code: getCookie('refearnapp_affiliate_cookie'),
    },
    settings: {
      displayMode: 'overlay',
      theme: 'light',
      successUrl: 'https://yoursite.com/success',
    },
  });
}
</script>
`,

  svelte: `<!-- Svelte Example -->
<script>
  import { onMount } from 'svelte';
  import { initializePaddle } from '@paddle/paddle-js';

  let paddle = null;

  onMount(async () => {
    paddle = await initializePaddle({
      environment: 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
    });
  });

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function handleCheckout() {
    if (!paddle) return;
    paddle.Checkout.open({
      items: [{ priceId: 'pri_XXX', quantity: 1 }],
      customData: {
        refearnapp_affiliate_code: getCookie('refearnapp_affiliate_cookie'),
      },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        successUrl: 'https://yoursite.com/success',
      },
    });
  }
</script>
`,

  sveltekit: `<!-- SvelteKit Client Example -->
<script>
  import { onMount } from 'svelte';
  import { initializePaddle } from '@paddle/paddle-js';

  let paddle = null;

  onMount(async () => {
    paddle = await initializePaddle({
      environment: 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
    });
  });

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function handleCheckout() {
    if (!paddle) return;
    paddle.Checkout.open({
      items: [{ priceId: 'pri_XXX', quantity: 1 }],
      customData: {
        refearnapp_affiliate_code: getCookie('refearnapp_affiliate_cookie'),
      },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        successUrl: 'https://yoursite.com/success',
      },
    });
  }
</script>
`,
};
export const serverSnippets = {
  Nextjs_serverAction: `// Next.js Server Action (App Router)
/app/actions/paddle/createCheckoutSession.ts

"use server";
import { cookies } from "next/headers";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
const paddle = new Paddle(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID!, {
  environment: Environment.sandbox,
});

export async function createCheckoutSession() {
  const cookieStore =await cookies();
  const affiliateCookie = cookieStore.get("refearnapp_affiliate_cookie");

   const txn = await paddle.transactions.create({
    items: [
      {
        quantity: 1,
        priceId: "pri_XXX", // Replace with your actual price ID
      },
    ],
    customData: {
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
        : null,
    },
  });

  console.log(txn);

  return NextResponse.json({ txn });
}`,

  Nextjs_apiRoutes: `import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const paddle = new Paddle(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID!, {
  environment: Environment.sandbox,
});

export async function GET(req: Request) {
  // 30 usd txn
  const cookieStore = await cookies();
  const affiliateCookie = cookieStore.get("refearnapp_affiliate_cookie");
  const txn = await paddle.transactions.create({
    items: [
      {
        quantity: 1,
        priceId: "pri_XXX",
      },
    ],
    customData: {
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
        : null,
    },
  });

  console.log(txn);

  return NextResponse.json({ txn });
}
`,

  express: `// Express Server Example
const paddle = new Paddle(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID!, {
  environment: Environment.sandbox,
});

app.post("/api/checkout", async (req, res) => {
  const affiliateCookie = req.cookies["refearnapp_affiliate_cookie"];

 const txn = await paddle.transactions.create({
    items: [
      {
        quantity: 1,
        priceId: "pri_XXX",
      },
    ],
    customData: {
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
        : null,
    },
  });

  console.log(txn);

  res.json({txn})
});`,

  sveltekit: `// SvelteKit Endpoint Example (+server.ts)
import { cookies } from "@sveltejs/kit";

const paddle = new Paddle(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID!, {
  environment: Environment.sandbox,
});
export async function POST({ cookies }) {
  const affiliateCookie = cookies.get("refearnapp_affiliate_cookie");

 const txn = await paddle.transactions.create({
    items: [
      {
        quantity: 1,
        priceId: "pri_XXX",
      },
    ],
    customData: {
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


const paddle = new Paddle(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID!, {
  environment: Environment.sandbox,
});

export default defineEventHandler(async (event) => {
  const affiliateCookie = getCookie(event, "refearnapp_affiliate_cookie");

  const txn = await paddle.transactions.create({
    items: [
      {
        quantity: 1,
        priceId: "pri_XXX",
      },
    ],
    customData: {
      refearnapp_affiliate_code: affiliateCookie
        ? decodeURIComponent(affiliateCookie.value)
        : null,
    },
  });

  return { url: session.url };
});`,
};
export const serverLabels = {
  Nextjs_serverAction: "Next.js Server Action",
  Nextjs_apiRoutes: "Next.js API Routes",
  express: "Express",
  sveltekit: "SvelteKit",
  nuxt: "Nuxt",
};
export const clientLabels = {
  react: "React",
  vue: "Vue 3",
  nuxt: "Nuxt 3",
  svelte: "Svelte",
  sveltekit: "SvelteKit",
};
