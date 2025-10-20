import { useState } from "react"

interface UseCachedValidationOptions {
  showError: (message: string) => void
  errorMessage: string
  maxCacheSize?: number // optional limit for stored failed values
}

/**
 * Prevents repeated validation calls for the same failed values.
 * Supports multiple cached failures (e.g., multiple emails or passwords).
 */
export function useCachedValidation({
  showError,
  errorMessage,
  maxCacheSize = 10,
}: UseCachedValidationOptions) {
  const [failedValues, setFailedValues] = useState<Set<string>>(new Set())
  function shouldSkip(value: string, customMessage?: string): boolean {
    const trimmed = value.trim()
    if (failedValues.has(trimmed)) {
      const message =
        customMessage ||
        errorMessage.replace("${value}", trimmed) ||
        errorMessage
      showError(message)
      return true
    }
    return false
  }

  function addFailedValue(value: string) {
    const trimmed = value.trim()
    setFailedValues((prev) => {
      const updated = new Set(prev)
      updated.add(trimmed)

      // Keep only last N failed values
      if (updated.size > maxCacheSize) {
        const oldest = Array.from(updated)[0]
        updated.delete(oldest)
      }
      return updated
    })
  }

  function clearCache() {
    setFailedValues(new Set())
  }

  return {
    shouldSkip,
    addFailedValue,
    clearCache,
  }
}
