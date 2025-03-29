import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface ErrorResponse {
  ok: boolean;
  status: number;
  error: string;
  toast?: string; // Unified message for client-side display
  fields?: Record<string, string> | null; // Optional field errors
}

interface PrismaErrorMeta {
  target?: string[];
  // Add other Prisma meta fields as needed
}

export function returnError(err: unknown): ErrorResponse {
  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    console.error("Prisma Error:", err.code, err.meta);

    // Handle unique constraint violation
    if (err.code === "P2002") {
      const meta = err.meta as PrismaErrorMeta;
      const fieldName = meta?.target?.[0] || "field";

      const friendlyNames: Record<string, string> = {
        email: "Email address",
        username: "Username",
        phone: "Phone number",
      };

      const friendlyName = friendlyNames[fieldName] || fieldName;
      const toastMessage = `${friendlyName} is already registered`;

      return {
        ok: false,
        status: 409,
        error: toastMessage, // Main error message
        toast: toastMessage, // Explicit toast message
        // Omitting fields since we want toast-only
      };
    }

    // Generic Prisma error
    return {
      ok: false,
      status: 500,
      error: "Database operation failed",
      toast: "A database error occurred",
    };
  }

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
