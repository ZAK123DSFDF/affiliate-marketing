import {
  AffiliateStatsField,
  affiliateStatsFields,
} from "@/util/AffiliateStatFields"
type RequiredFields = "id" | "email"
export type ExcludableFields = Exclude<AffiliateStatsField, RequiredFields>

type BuildOptions = {
  include?: AffiliateStatsField[]
  exclude?: ExcludableFields[]
}

export function buildAffiliateStatsSelect(opts?: BuildOptions) {
  const { include, exclude } = opts ?? {}

  const required: RequiredFields[] = ["id", "email"]

  if (include?.length) {
    const finalInclude = Array.from(new Set([...include, ...required]))
    return Object.fromEntries(
      finalInclude.map((key) => [key, affiliateStatsFields[key]])
    ) as Partial<typeof affiliateStatsFields>
  }

  if (exclude?.length) {
    return Object.fromEntries(
      Object.entries(affiliateStatsFields).filter(
        ([key]) => !exclude.includes(key as ExcludableFields)
      )
    )
  }

  return affiliateStatsFields
}
