"use server"

import jwt from "jsonwebtoken"
import { sendVerificationEmail } from "@/lib/mail"
import { returnError } from "@/lib/errorHandler"
import { getOrganizationContext } from "@/lib/server/getOrganizationContext"
import { db } from "@/db/drizzle"
import { and, eq } from "drizzle-orm"
import { affiliate, user } from "@/db/schema"
import { getBaseUrl } from "@/lib/server/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"
// ------------------- ORGANIZATION -------------------
export const requestOrganizationEmailChange = async ({
  userId,
  newEmail,
}: {
  userId: string
  newEmail: string
}) => {
  try {
    if (!newEmail) throw { status: 400, toast: "New email required" }
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, newEmail),
    })

    if (existingUser) {
      throw { status: 400, toast: "Email already in use" }
    }

    const { orgIds, activeOrgId, role, type } = await getOrganizationContext()
    const token = jwt.sign(
      {
        id: userId,
        newEmail,
        type,
        role,
        orgIds,
        activeOrgId,
        mode: "changeEmail",
      },
      process.env.SECRET_KEY!,
      { expiresIn: "15m" }
    )
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email-change?organizationToken=${token}`
    if (process.env.NODE_ENV === "development") {
      await sendVerificationEmail(newEmail, verifyUrl)
      return { ok: true, message: "Verification link sent to new email" }
    }
    return {
      ok: true,
      message: "Verification link sent",
      redirectUrl: verifyUrl,
    }
  } catch (err) {
    console.error("requestOrganizationEmailChange error:", err)
    return returnError(err)
  }
}

// ------------------- AFFILIATE -------------------
export const requestAffiliateEmailChange = async ({
  affiliateId,
  newEmail,
  orgId,
}: {
  affiliateId: string
  newEmail: string
  orgId: string
}) => {
  try {
    if (!newEmail) throw { status: 400, toast: "New email required" }

    const existingAffiliate = await db.query.affiliate.findFirst({
      where: and(
        eq(affiliate.email, newEmail),
        eq(affiliate.organizationId, orgId)
      ),
    })

    if (existingAffiliate) {
      throw { status: 400, toast: "Email already in use in this organization" }
    }
    const token = jwt.sign(
      {
        id: affiliateId,
        newEmail,
        type: "AFFILIATE",
        orgId,
        mode: "changeEmail",
      },
      process.env.SECRET_KEY!,
      { expiresIn: "15m" }
    )
    const baseUrl = await getBaseUrl()
    const verifyUrl = buildAffiliateUrl({
      path: "verify-email-change",
      organizationId: orgId,
      token,
      baseUrl,
    })
    if (process.env.NODE_ENV === "development") {
      await sendVerificationEmail(newEmail, verifyUrl)
      return { ok: true, message: "Verification link sent to new email" }
    }
    return {
      ok: true,
      message: "Verification link sent",
      redirectUrl: verifyUrl,
    }
  } catch (err) {
    console.error("requestAffiliateEmailChange error:", err)
    return returnError(err)
  }
}
