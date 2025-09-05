"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const InvalidError = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md">
        <Card className="relative transition-shadow duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-destructive">
              Invalid Token
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              The verification link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InvalidError
