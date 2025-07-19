"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FrameworkInstructions from "@/components/pages/Dashboard/Integration/FrameworkInstructions";

export default function StripeIntegration() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // You can fetch from API or context to determine Stripe connection status
    fetch("/api/stripe/status") // ← You'll need to implement this
      .then((res) => res.json())
      .then((data) => setConnected(data.connected));
  }, []);

  const handleConnect = () => {
    window.location.href = "/api/stripe/connect";
  };

  const handleDisconnect = async () => {
    await fetch("/api/stripe/disconnect", {
      method: "POST",
      body: JSON.stringify({ stripeAccountId: "your_account_id_here" }),
    });
    setConnected(false);
  };

  return (
    <div className="space-y-4">
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

      <FrameworkInstructions />
    </div>
  );
}
