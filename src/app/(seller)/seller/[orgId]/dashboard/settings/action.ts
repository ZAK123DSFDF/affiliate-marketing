// app/actions/auth/orgInfo.ts
"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { returnError } from "@/lib/errorHandler"
import { OrgData } from "@/lib/types/organization"
import { organization } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ResponseData } from "@/lib/types/response"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import { revalidatePath } from "next/cache"

export const orgInfo = async (
  orgId: string
): Promise<ResponseData<OrgData>> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("sellerToken")?.value

    if (!token) {
      throw {
        status: 401,
        error: "Unauthorized",
        toast: "You must be logged in.",
      }
    }

    const decoded = jwt.decode(token) as { id: string }
    if (!decoded?.id) {
      throw {
        status: 400,
        error: "Invalid token",
        toast: "Session invalid or expired.",
      }
    }

    // Fetch organization details
    const org = await db.query.organization.findFirst({
      where: (org, { eq }) => eq(org.id, orgId),
    })

    if (!org) {
      throw {
        status: 404,
        error: "Organization not found",
        toast: "The requested organization does not exist.",
      }
    }

    return {
      ok: true,
      data: {
        id: org.id,
        name: org.name,
        domainName: org.domainName,
        logoUrl: org.logoUrl ?? "",
        referralParam: org.referralParam as "ref" | "via" | "aff",
        cookieLifetimeValue: String(org.cookieLifetimeValue ?? "30"),
        cookieLifetimeUnit: org.cookieLifetimeUnit as
          | "day"
          | "week"
          | "month"
          | "year",
        commissionType: org.commissionType as "percentage" | "fixed",
        commissionValue: String(org.commissionValue ?? "0.00"),
        commissionDurationValue: String(org.commissionDurationValue ?? "30"),
        commissionDurationUnit: org.commissionDurationUnit as
          | "day"
          | "week"
          | "month"
          | "year",
        currency: (org.currency ?? "USD") as
          | "USD"
          | "EUR"
          | "GBP"
          | "CAD"
          | "AUD",
        attributionModel: org.attributionModel,
      },
    }
  } catch (err) {
    console.error("orgInfo error:", err)
    return returnError(err) as ResponseData<OrgData>
  }
}
export async function updateOrgSettings(
  data: Partial<OrgData> & { id: string }
) {
  try {
    await getOrgAuth(data.id)
    console.log("data", data)
    const updateData: Record<string, any> = {
      ...(data.name && { name: data.name.trim() }),
      ...(data.domainName && {
        domainName: data.domainName.trim().replace(/^https?:\/\//, ""),
      }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl || null }),
      ...(data.referralParam && { referralParam: data.referralParam }),
      ...(data.cookieLifetimeValue && {
        cookieLifetimeValue: data.cookieLifetimeValue,
      }),
      ...(data.cookieLifetimeUnit && {
        cookieLifetimeUnit: data.cookieLifetimeUnit,
      }),
      ...(data.commissionType && { commissionType: data.commissionType }),
      ...(data.commissionValue && {
        commissionValue: Number(data.commissionValue).toFixed(2),
      }),
      ...(data.commissionDurationValue && {
        commissionDurationValue: data.commissionDurationValue,
      }),
      ...(data.commissionDurationUnit && {
        commissionDurationUnit: data.commissionDurationUnit,
      }),
      ...(data.currency && { currency: data.currency }),
      ...(data.attributionModel && { attributionModel: data.attributionModel }),
    }

    if (Object.keys(updateData).length === 0) {
      return { ok: true }
    }

    await db
      .update(organization)
      .set(updateData)
      .where(eq(organization.id, data.id))
    revalidatePath(`/seller/${data.id}/dashboard/settings`)
    return { ok: true }
  } catch (err) {
    console.error("updateOrgSettings error", err)
    return returnError(err)
  }
}
