export const sanitizeDomain = (domain: string) => {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "") // remove http:// or https://
    .replace(/\/+$/, "") // remove trailing slashes
}
