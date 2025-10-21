import { atomWithStorage } from "jotai/utils"

interface CacheNamespace {
  failedValues: string[]
  errorMessage: string | null
  maxCacheSize: number
}
export function getCacheAtom(id: string, cacheScope: string) {
  return atomWithStorage<CacheNamespace>(`refearnapp-${cacheScope}-${id}`, {
    failedValues: [],
    errorMessage: null,
    maxCacheSize: 10,
  })
}
