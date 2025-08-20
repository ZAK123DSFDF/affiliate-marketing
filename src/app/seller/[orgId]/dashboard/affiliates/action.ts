"use server";

import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { AffiliateStats } from "@/lib/types/affiliateStats";
import { getOrgAuth } from "@/lib/server/GetOrgAuth";
import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats";

export async function getAffiliatesWithStats(
  orgId: string,
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliateStats[]>> {
  try {
    await getOrgAuth(orgId);
    const rows = (await getAffiliatesWithStatsAction(
      orgId,
      year,
      month,
    )) as AffiliateStats[];
    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatesWithStats error:", err);
    return returnError(err) as ResponseData<AffiliateStats[]>;
  }
}
