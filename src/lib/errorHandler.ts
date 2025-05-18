interface ErrorResponse {
  ok: boolean;
  status: number;
  error: string;
  toast?: string; // Unified message for client-side display
  fields?: Record<string, string> | null; // Optional field errors
}

export function returnError(err: unknown): ErrorResponse {
  // Handle custom thrown errors
  if (typeof err === "object" && err !== null) {
    const errorObj = err as Partial<ErrorResponse>;

    // Log the error
    console.error(
      `Error - Status: ${errorObj.status || 500}, ` +
        `Message: ${errorObj.error || "Internal Server Error"}`,
    );

    return {
      ok: false,
      status: errorObj.status || 500,
      error: errorObj.error || "Internal server error",
      toast: errorObj.toast || errorObj.error || "Something went wrong",
      fields: errorObj.fields || null,
    };
  }

  // Fallback for unknown errors
  return {
    ok: false,
    status: 500,
    error: "Internal server error",
    toast: "Something went wrong",
  };
}
