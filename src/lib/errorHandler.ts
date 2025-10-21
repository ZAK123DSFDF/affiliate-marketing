interface ErrorResponse {
  ok: false
  status: number
  error: string
  toast?: string // Unified message for client-side display
  fields?: Record<string, string> | null // Optional field errors
  data?: any
}

export function returnError(err: unknown): ErrorResponse {
  console.error("Full error object:", err)

  // Handle Drizzle/Postgres errors
  if (err instanceof Error) {
    return {
      ok: false,
      status: 500,
      error: err.message,
      toast: "Database query failed",
      fields: null,
    }
  }
  if (typeof err === "object" && err !== null) {
    const errorObj = err as Partial<ErrorResponse>
    return {
      ok: false,
      status: errorObj.status || 500,
      error: errorObj.error || "Unknown error",
      toast: errorObj.toast || "Something went wrong",
      fields: errorObj.fields || null,
      data: (errorObj as any).data,
    }
  }

  return {
    ok: false,
    status: 500,
    error: "Internal server error",
    toast: "Something went wrong",
  }
}
