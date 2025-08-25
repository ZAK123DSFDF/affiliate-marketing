"use server"

import { cookies } from "next/headers"
import { returnError } from "@/lib/errorHandler"
import {
  organization,
  organizationAuthCustomization,
  organizationDashboardCustomization,
  userToOrganization,
} from "@/db/schema"
import { db } from "@/db/drizzle"
import { companySchema } from "@/components/pages/Create-Company"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { calculateExpirationDate } from "@/util/CalculateExpiration"
import { defaultAuthCustomization } from "@/customization/Auth/defaultAuthCustomization"
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization"

export const CreateOrganization = async (
  data: z.infer<typeof companySchema>
) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      throw {
        status: 401,
        error: "Unauthorized",
        toast: "You must be logged in to create an organization.",
      }
    }

    const decoded = jwt.decode(token) as {
      id: string
      email: string
      role: string
      type: string
    }
    const sanitizedDomain = data.domainName
      .replace(/^https?:\/\//i, "")
      .replace(/\/$/, "")
    const now = new Date()
    const expirationDate = calculateExpirationDate(
      now,
      data.commissionDurationValue,
      data.commissionDurationUnit
    )
    // Insert the new organization
    const [newOrg] = await db
      .insert(organization)
      .values({
        ...data,
        domainName: sanitizedDomain,
        commissionValue: data.commissionValue.toFixed(2),
        expirationDate,
      })
      .returning()

    if (!newOrg) {
      throw {
        status: 500,
        error: "Organization creation failed",
        toast: "Failed to create organization. Please try again.",
      }
    }

    // Link user to organization
    await db.insert(userToOrganization).values({
      userId: decoded.id,
      organizationId: newOrg.id,
    })
    await db
      .insert(organizationAuthCustomization)
      .values({
        id: newOrg.id,
        auth: defaultAuthCustomization,
      })
      .onConflictDoUpdate({
        target: organizationAuthCustomization.id,
        set: { auth: defaultAuthCustomization },
      })

    await db
      .insert(organizationDashboardCustomization)
      .values({
        id: newOrg.id,
        dashboard: defaultDashboardCustomization,
      })
      .onConflictDoUpdate({
        target: organizationDashboardCustomization.id,
        set: { dashboard: defaultDashboardCustomization },
      })
    return { ok: true, data: newOrg }
  } catch (err) {
    console.error("Organization create error", err)
    return returnError(err)
  }
}
