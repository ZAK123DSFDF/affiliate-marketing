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

export const orgInfo = async (
  orgId: string
): Promise<ResponseData<OrgData>> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

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

    const userId = decoded.id
    const relation = await db.query.userToOrganization.findFirst({
      where: (uto, { and, eq }) =>
        and(eq(uto.userId, userId), eq(uto.organizationId, orgId)),
    })

    if (!relation) {
      throw {
        status: 403,
        error: "Access denied",
        toast: "You do not have access to this organization.",
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
        logoUrl: org.logoUrl ?? "", // Already unioned with `string | null`
        referralParam: org.referralParam as "ref" | "via" | "aff",
        cookieLifetimeValue: org.cookieLifetimeValue ?? 30,
        cookieLifetimeUnit: org.cookieLifetimeUnit as
          | "day"
          | "week"
          | "month"
          | "year",
        commissionType: org.commissionType as "percentage" | "fixed",
        commissionValue: org.commissionValue ?? "0.00",
        commissionDurationValue: org.commissionDurationValue ?? 30,
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
export async function updateOrgSettings(data: OrgData) {
  try {
    await getOrgAuth(data.id)
    await db
      .update(organization)
      .set({
        name: data.name.trim(),
        domainName: data.domainName.trim().replace(/^https?:\/\//, ""),
        logoUrl: data.logoUrl || null,
        referralParam: data.referralParam,
        cookieLifetimeValue: data.cookieLifetimeValue,
        cookieLifetimeUnit: data.cookieLifetimeUnit,
        commissionType: data.commissionType,
        commissionValue: Number(data.commissionValue).toFixed(2),
        commissionDurationValue: data.commissionDurationValue,
        commissionDurationUnit: data.commissionDurationUnit,
        currency: data.currency,
        attributionModel: data.attributionModel,
      })
      .where(eq(organization.id, data.id))
    return { ok: true }
  } catch (err) {
    console.error("updateOrgSettings error", err)
    return returnError(err)
  }
}
