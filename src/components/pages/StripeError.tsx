"use client"

import React from "react"
import { XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StripeError({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border border-destructive/20">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-semibold text-destructive">
              Stripe Connection Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>
              {message
                ? decodeURIComponent(message)
                : "Something went wrong while connecting to Stripe."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
