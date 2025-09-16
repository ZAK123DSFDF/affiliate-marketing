"use server"

import { cookies } from "next/headers"
import { returnError } from "@/lib/errorHandler"
import {
  organization,
  organizationAuthCustomization,
  organizationDashboardCustomization,
} from "@/db/schema"
import { db } from "@/db/drizzle"
import { companySchema } from "@/components/pages/Create-Company"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { defaultAuthCustomization } from "@/customization/Auth/defaultAuthCustomization"
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization"

export const CreateOrganization = async (
  input: z.infer<typeof companySchema> & { mode: "create" | "add" }
) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("sellerToken")?.value
    if (!token) throw { status: 401, error: "Unauthorized" }

    const decoded = jwt.decode(token) as {
      id: string
      email: string
      role: string
      type: string
      exp: number
      iat: number
      orgIds?: string[]
    }

    const sanitizedDomain = input.domainName
      .replace(/^https?:\/\//i, "")
      .replace(/\/$/, "")

    const [newOrg] = await db
      .insert(organization)
      .values({
        ...input,
        domainName: sanitizedDomain,
        commissionValue: input.commissionValue.toFixed(2),
        userId: decoded.id,
      })
      .returning()

    if (!newOrg) throw { status: 500, error: "Failed to create org" }

    await Promise.all([
      db
        .insert(organizationAuthCustomization)
        .values({ id: newOrg.id, auth: defaultAuthCustomization })
        .onConflictDoUpdate({
          target: organizationAuthCustomization.id,
          set: { auth: defaultAuthCustomization },
        }),

      db
        .insert(organizationDashboardCustomization)
        .values({ id: newOrg.id, dashboard: defaultDashboardCustomization })
        .onConflictDoUpdate({
          target: organizationDashboardCustomization.id,
          set: { dashboard: defaultDashboardCustomization },
        }),
    ])
    // 🟢 Decide how to build new orgIds array
    let orgIds: string[]
    if (input.mode === "create") {
      orgIds = [newOrg.id]
    } else {
      orgIds = [...(decoded.orgIds || []), newOrg.id]
    }

    // Active org is the one just created
    const newPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      type: decoded.type,
      orgIds,
      activeOrgId: newOrg.id,
    }

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
    const newToken = jwt.sign(newPayload, process.env.SECRET_KEY!, {
      expiresIn,
    })

    cookieStore.set("sellerToken", newToken, { httpOnly: true })
    return { ok: true, message: "Company created successfully!", data: newOrg }
  } catch (err) {
    console.error("Organization create error", err)
    return returnError(err)
  }
}
