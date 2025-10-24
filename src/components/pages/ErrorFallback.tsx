"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle, Rocket } from "lucide-react"

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error caught by boundary:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/40 p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Rocket className="w-6 h-6 text-primary" strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">
          Refearn
        </span>
      </div>

      {/* Error Card */}
      <Card className="max-w-md w-full shadow-md border border-border/60">
        <CardHeader className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center">
            Something went wrong
          </h2>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground space-y-3">
          <p>
            We encountered an unexpected error. You can try reloading this page
            or return to your dashboard.
          </p>
          {error.message && (
            <p className="text-xs bg-muted p-2 rounded-md border border-border/50">
              {error.message}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => location.reload()}>
            Reload Page
          </Button>
          <Button onClick={() => reset()}>Try Again</Button>
        </CardFooter>
      </Card>

      {/* Footer */}
      <p className="mt-6 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Refearn. All rights reserved.
      </p>
    </div>
  )
}
