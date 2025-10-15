export function getCookieDomain(baseUrl: string) {
  try {
    const host = new URL(baseUrl).hostname
    // if it's a subdomain like shipfast.refearnapp.com → make it .refearnapp.com
    const parts = host.split(".")
    if (parts.length > 2) {
      return `.${parts.slice(-2).join(".")}`
    }
    return host
  } catch {
    return undefined
  }
}
