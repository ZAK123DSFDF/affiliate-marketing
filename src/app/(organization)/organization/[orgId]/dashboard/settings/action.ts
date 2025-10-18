// app/actions/auth/orgInfo.ts
"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { returnError } from "@/lib/errorHandler"
import { OrgData } from "@/lib/types/organization"
import { organization, websiteDomain } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { MutationData, ResponseData } from "@/lib/types/response"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import { revalidatePath } from "next/cache"
import dns from "dns/promises"

const EXPECTED_CNAME = "cname.refearnapp.com"
const EXPECTED_IP = "123.45.67.89"

export const orgInfo = async (
  orgId: string
): Promise<ResponseData<OrgData>> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("organizationToken")?.value

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
    const website = await db.query.websiteDomain.findFirst({
      where: (domain, { eq, and }) =>
        and(
          eq(domain.orgId, orgId),
          eq(domain.isActive, true),
          eq(domain.isRedirect, false)
        ),
    })

    return {
      ok: true,
      data: {
        id: org.id,
        name: org.name,
        websiteUrl: org.websiteUrl,
        logoUrl: org.logoUrl ?? "",
        referralParam: org.referralParam as "ref" | "via" | "aff",
        cookieLifetimeValue: org.cookieLifetimeValue,
        cookieLifetimeUnit: org.cookieLifetimeUnit as
          | "day"
          | "week"
          | "month"
          | "year",
        commissionType: org.commissionType as "percentage" | "fixed",
        commissionValue: String(org.commissionValue ?? "0.00"),
        commissionDurationValue: org.commissionDurationValue,
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
        defaultDomain: website?.domainName?.endsWith(".refearnapp.com")
          ? website.domainName.replace(".refearnapp.com", "")
          : (website?.domainName ?? ""),
      },
    }
  } catch (err) {
    console.error("orgInfo error:", err)
    return returnError(err) as ResponseData<OrgData>
  }
}
export async function updateOrgSettings(
  data: Partial<OrgData> & { id: string }
): Promise<MutationData> {
  try {
    await getOrgAuth(data.id)
    console.log("data", data)
    const updateData: Record<string, any> = {
      ...(data.name && { name: data.name.trim() }),
      ...(data.websiteUrl && {
        websiteUrl: data.websiteUrl.trim().replace(/^https?:\/\//, ""),
      }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl || null }),
      ...(data.referralParam && { referralParam: data.referralParam }),
      ...(data.cookieLifetimeValue && {
        cookieLifetimeValue: Math.round(Number(data.cookieLifetimeValue)),
      }),
      ...(data.cookieLifetimeUnit && {
        cookieLifetimeUnit: data.cookieLifetimeUnit,
      }),
      ...(data.commissionType && { commissionType: data.commissionType }),
      ...(data.commissionValue && {
        commissionValue: Number(Number(data.commissionValue).toFixed(2)),
      }),
      ...(data.commissionDurationValue && {
        commissionDurationValue: Math.round(
          Number(data.commissionDurationValue)
        ),
      }),
      ...(data.commissionDurationUnit && {
        commissionDurationUnit: data.commissionDurationUnit,
      }),
      ...(data.currency && { currency: data.currency }),
      ...(data.attributionModel && { attributionModel: data.attributionModel }),
    }

    // ✅ Handle domain update
    if (data.defaultDomain) {
      const normalizedDomain = data.defaultDomain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")

      // Get currently active domain of the org
      const [activeDomain] = await db
        .select()
        .from(websiteDomain)
        .where(
          and(
            eq(websiteDomain.orgId, data.id),
            eq(websiteDomain.isActive, true),
            eq(websiteDomain.isRedirect, false)
          )
        )

      // Check if the new domain already exists in DB
      const [existingDomain] = await db
        .select()
        .from(websiteDomain)
        .where(eq(websiteDomain.domainName, normalizedDomain))

      if (existingDomain) {
        if (existingDomain.orgId === data.id) {
          // 🟢 Case 1: Belongs to current org — re-activate it
          await db
            .update(websiteDomain)
            .set({
              isActive: true,
              isRedirect: false,
              updatedAt: new Date(),
            })
            .where(eq(websiteDomain.id, existingDomain.id))

          // Mark previous domain as redirect (if exists and different)
          if (activeDomain && activeDomain.id !== existingDomain.id) {
            await db
              .update(websiteDomain)
              .set({
                isActive: false,
                isRedirect: true,
                updatedAt: new Date(),
              })
              .where(eq(websiteDomain.id, activeDomain.id))
          }
        } else {
          // 🔴 Case 3: Belongs to another org
          throw {
            status: 400,
            error: "Domain already exists in another organization",
            toast:
              "This domain is already linked to another organization. Please use a different domain.",
          }
        }
      } else {
        // 🟡 Case 2: New domain — insert
        if (activeDomain) {
          await db
            .update(websiteDomain)
            .set({
              isActive: false,
              isRedirect: true,
              updatedAt: new Date(),
            })
            .where(eq(websiteDomain.id, activeDomain.id))
        }

        await db.insert(websiteDomain).values({
          orgId: data.id,
          domainName: normalizedDomain,
          isActive: true,
          isRedirect: false,
          type: normalizedDomain.endsWith(".refearnapp.com")
            ? "DEFAULT"
            : "CUSTOM",
        })
      }
    }

    // ✅ Only update org if there are changes
    if (Object.keys(updateData).length > 0) {
      await db
        .update(organization)
        .set(updateData)
        .where(eq(organization.id, data.id))
    }

    revalidatePath(`/organization/${data.id}/dashboard/settings`)
    return { ok: true }
  } catch (err) {
    console.error("updateOrgSettings error", err)
    return returnError(err)
  }
}
export async function verifyCNAME(domain: string): Promise<MutationData> {
  try {
    if (process.env.NODE_ENV === "production") {
      const records = await dns.resolveCname(domain)
      const isValid = records.some((record) => record === EXPECTED_CNAME)

      if (!isValid) {
        throw {
          status: 400,
          error: "Invalid CNAME record",
          toast: `❌ Expected ${EXPECTED_CNAME}, but got ${records.join(", ")}`,
        }
      }
    } else {
      console.log(`Simulating CNAME verification for ${domain}`)
      await new Promise((r) => setTimeout(r, 1000))
    }

    return {
      ok: true,
      toast: "✅ CNAME record is correctly set.",
    }
  } catch (err) {
    return returnError(err)
  }
}

// ✅ Verify A record (for main domains)
export async function verifyARecord(domain: string): Promise<MutationData> {
  try {
    if (process.env.NODE_ENV === "production") {
      const records = await dns.resolve4(domain)
      const isValid = records.includes(EXPECTED_IP)

      if (!isValid) {
        throw {
          status: 400,
          error: "Invalid A record",
          toast: `❌ Expected IP ${EXPECTED_IP}, but got ${records.join(", ")}`,
        }
      }
    } else {
      console.log(`Simulating A record verification for ${domain}`)
      await new Promise((r) => setTimeout(r, 1000))
    }

    return {
      ok: true,
      toast: "✅ A record is correctly set.",
    }
  } catch (err) {
    return returnError(err)
  }
}
