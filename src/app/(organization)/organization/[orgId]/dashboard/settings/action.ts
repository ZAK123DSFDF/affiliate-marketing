// app/actions/auth/orgInfo.ts
"use server"
import { OrgData } from "@/lib/types/organization"
import { MutationData, ResponseData } from "@/lib/types/response"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import dns from "dns/promises"
import { handleAction } from "@/lib/handleAction"
import { getOrgData } from "@/lib/server/getOrgData"
import { updateSettings } from "@/lib/organizationAction/UpdateSettings"
import { verifyOrgCNAME } from "@/lib/organizationAction/verifyOrgCNAME"
import { verifyOrgARECORD } from "@/lib/organizationAction/verifyOrgARECORD"

const EXPECTED_CNAME = "cname.refearnapp.com"
const EXPECTED_IP = "123.45.67.89"

export const orgInfo = async (
  orgId: string
): Promise<ResponseData<OrgData>> => {
  return handleAction("orgInfo", async () => {
    return await getOrgData(orgId, false)
  })
}
export async function updateOrgSettings(
  data: Partial<OrgData> & { id: string }
): Promise<MutationData> {
  return handleAction("updateOrgSettings", async () => {
    await getOrgAuth(data.id)
    await updateSettings(data.id)
    return { ok: true, toast: "Successfully Updated Org Settings" }
  })
}
export async function verifyCNAME(domain: string): Promise<MutationData> {
  return handleAction("verifyCNAME", async () => {
    await verifyOrgCNAME(domain)

    return {
      ok: true,
      toast: "✅ CNAME record is correctly set.",
    }
  })
}

// ✅ Verify A record (for main domains)
export async function verifyARecord(domain: string): Promise<MutationData> {
  return handleAction("verifyARecord", async () => {
    await verifyOrgARECORD(domain)

    return {
      ok: true,
      toast: "✅ A record is correctly set.",
    }
  })
}
