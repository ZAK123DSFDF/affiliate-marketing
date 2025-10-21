"use server"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { revalidatePath } from "next/cache"
import { returnError } from "@/lib/errorHandler"
import { MutationData, ResponseData } from "@/lib/types/response"
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats"
import { getAffiliateLinksWithStatsAction } from "@/lib/server/getAffiliateLinksWithStats"
import { createFullUrl } from "@/lib/server/createFullUrl"
import { getBaseUrl } from "@/lib/server/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"
import { handleAction } from "@/lib/handleAction"

export const createAffiliateLink = async (
  orgId: string
): Promise<MutationData & { data: string }> => {
  return handleAction("createAffiliateLink", async () => {
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
    return { ok: true, data: fullUrl }
  })
}

export const getAffiliateLinksWithStats = async (
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateLinkWithStats[]>> => {
  return handleAction("getAffiliateLinksWithStats", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const rows = await getAffiliateLinksWithStatsAction(decoded, year, month)

    return { ok: true, data: rows }
  })
}
