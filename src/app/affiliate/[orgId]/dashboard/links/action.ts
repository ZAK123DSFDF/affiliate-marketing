"use server"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { revalidatePath } from "next/cache"
import { returnError } from "@/lib/errorHandler"
import { ResponseData } from "@/lib/types/response"
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats"
import { getAffiliateLinksWithStatsAction } from "@/lib/server/getAffiliateLinksWithStats"
import { createFullUrl } from "@/lib/server/createFullUrl"
import { getBaseUrl } from "@/lib/server/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"

export const createAffiliateLink = async (orgId: string) => {
  const decoded = await getAffiliateOrganization(orgId)
  const { org, fullUrl } = await createFullUrl(decoded)
  const baseUrl = await getBaseUrl()
  const revalidationPath = buildAffiliateUrl({
    path: "dashboard/links",
    organizationId: org.id,
    baseUrl,
    partial: true,
  })
  revalidatePath(revalidationPath)
  return fullUrl
}

export const getAffiliateLinksWithStats = async (
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateLinkWithStats[]>> => {
  try {
    const decoded = await getAffiliateOrganization(orgId)
    const rows = await getAffiliateLinksWithStatsAction(decoded, year, month)

    return { ok: true, data: rows }
  } catch (err) {
    console.error("getAffiliateLinksWithStats error:", err)
    return returnError(err) as ResponseData<AffiliateLinkWithStats[]>
  }
}
