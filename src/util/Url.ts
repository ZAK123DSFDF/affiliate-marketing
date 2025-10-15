interface BuildAffiliateUrlOptions {
  path: string
  organizationId?: string
  token?: string
  baseUrl?: string
  partial?: boolean
}

export const buildAffiliateUrl = ({
  path,
  organizationId,
  token,
  baseUrl,
  partial = false,
}: BuildAffiliateUrlOptions) => {
  const urlBase =
    baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const needsOrgPath =
    urlBase.includes("localhost:3000") || urlBase === "https://refearnapp.com"
  let relativePath = needsOrgPath
    ? `/affiliate/${organizationId}/${path}`
    : `/${path}`

  if (token) {
    const separator = relativePath.includes("?") ? "&" : "?"
    relativePath += `${separator}affiliateToken=${token}`
  }
  return partial ? relativePath : `${urlBase}${relativePath}`
}
