export function buildCacheScope(affiliate: boolean, orgId?: string) {
  const safeId = orgId || "create"
  return affiliate ? `aff-${safeId}` : `usr-${safeId}`
}
// Removes all validation cache entries from localStorage
export function clearValidationCachesFor(affiliate: boolean, orgId?: string) {
  const cacheScope = buildCacheScope(affiliate, orgId)
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`refearnapp-${cacheScope}-`)) {
      localStorage.removeItem(key)
    }
  })
}

// Removes a specific validation cache entry
export function removeValidationCache(
  affiliate: boolean,
  orgId: string | undefined,
  id: string
) {
  const cacheScope = buildCacheScope(affiliate, orgId)
  localStorage.removeItem(`refearnapp-${cacheScope}-${id}`)
}
export function clearAllValidationCaches() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("refearnapp-")) {
      localStorage.removeItem(key)
    }
  })
}
