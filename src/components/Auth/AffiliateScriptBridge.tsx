// components/AffiliateScriptBridge.tsx
"use client";
import Script from "next/script";

export function AffiliateScriptBridge() {
  return (
    <Script
      src="http://localhost:3000/api/check"
      strategy="beforeInteractive"
    />
  );
}
