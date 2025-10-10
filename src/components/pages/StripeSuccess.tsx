"use client"

import React from "react"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StripeSuccess({ account }: { account?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border border-green-200">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-green-700">
              Stripe Connection Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>Your Stripe account has been successfully connected.</p>
            {account && (
              <p className="mt-2 text-sm text-foreground/80">
                Connected Account ID:{" "}
                <span className="font-medium">{account}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
