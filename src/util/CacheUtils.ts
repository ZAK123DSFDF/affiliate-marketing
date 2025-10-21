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
