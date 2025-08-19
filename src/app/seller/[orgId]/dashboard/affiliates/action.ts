"use server";

import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { AffiliateStats } from "@/lib/types/affiliateStats";
import { getOrgAuth } from "@/lib/server/GetOrgAuth";
import { getOrgAffiliateLinks } from "@/lib/server/GetOrgAffiliateLinks";
import { getOrgClicksAndInvoiceAggregate } from "@/lib/server/GetOrgClicksAndInvoiceAggregate";
import { getClickInvoiceAggregate } from "@/lib/server/getClickInvoiceAggregate";
import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats";

export async function getAffiliatesWithStats(
  orgId: string,
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliateStats[]>> {
  try {
    await getOrgAuth(orgId);
    const rows = await getAffiliatesWithStatsAction(orgId, year, month);
    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatesWithStats error:", err);
    return returnError(err) as ResponseData<AffiliateStats[]>;
  }
}
