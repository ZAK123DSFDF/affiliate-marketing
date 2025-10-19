import slugify from "slugify"

export function generateUniqueSubdomain(name: string) {
  if (!name) return ""
  return slugify(name.trim(), { lower: true })
}
