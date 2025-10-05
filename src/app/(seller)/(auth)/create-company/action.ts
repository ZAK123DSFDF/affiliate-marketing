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
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { eq } from "drizzle-orm"

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

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
        logoUrl: input.logoUrl || null,
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
export async function deleteOrganizationLogo(logoUrl: string) {
  console.log("Deleting logo:", logoUrl)
  if (!logoUrl) throw new Error("Missing logoUrl")

  // 1. Extract the object key from R2 public URL
  const uploadPath = logoUrl.replace(`${process.env.R2_ACCESS_URL}/`, "")

  // 2. Delete from R2
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uploadPath,
    })
  )

  return { success: true }
}
export async function updateOrganizationLogo({
  orgId,
  logoUrl,
}: {
  orgId: string
  logoUrl: string | null
}) {
  if (!orgId) throw new Error("Missing orgId")

  await db
    .update(organization)
    .set({ logoUrl })
    .where(eq(organization.id, orgId))

  return { success: true, url: logoUrl }
}
