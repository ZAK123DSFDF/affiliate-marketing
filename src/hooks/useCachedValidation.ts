import { useAtom } from "jotai"
import { getCacheAtom } from "@/store/CacheAtom"
import { buildCacheScope } from "@/util/CacheUtils"

export function useCachedValidation({
  id,
  orgId,
  affiliate,
  showError,
  errorMessage,
  maxCacheSize = 10,
}: {
  id: string
  orgId?: string
  affiliate: boolean
  showError: (msg: string) => void
  errorMessage: string
  maxCacheSize?: number
}) {
  const cacheScope = buildCacheScope(affiliate, orgId)
  const [cache, setCache] = useAtom(getCacheAtom(id, cacheScope))

  function shouldSkip(value: string, customMessage?: string): boolean {
    const trimmed = value.trim()
    if (cache.failedValues.includes(trimmed)) {
      showError(customMessage || errorMessage)
      return true
    }
    return false
  }

  function addFailedValue(value: string) {
    const trimmed = value.trim()
    if (!cache.failedValues.includes(trimmed)) {
      const updated = [...cache.failedValues, trimmed].slice(-maxCacheSize)
      setCache({ ...cache, failedValues: updated })
    }
  }
  return { shouldSkip, addFailedValue }
}
