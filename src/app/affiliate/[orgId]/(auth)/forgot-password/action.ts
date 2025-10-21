"use server"

import { db } from "@/db/drizzle"
import jwt from "jsonwebtoken"
import { returnError } from "@/lib/errorHandler"
import { sendVerificationEmail } from "@/lib/mail"
import { getBaseUrl } from "@/lib/server/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"
import { MutationData } from "@/lib/types/response"
import { handleAction } from "@/lib/handleAction"

export const ForgotPasswordAffiliateServer = async ({
  email,
  organizationId,
}: {
  email: string
  organizationId: string
}): Promise<MutationData> => {
  return handleAction("Forgot Password Affiliate Server", async () => {
    if (!email || !organizationId) {
      throw {
        status: 400,
        error: "Email and organization are required.",
        toast: "Please enter your email.",
        fields: {
          email: !email ? "Email is required" : "",
          organizationId: !organizationId ? "Organization is required" : "",
        },
      }
    }

    const existingAffiliate = await db.query.affiliate.findFirst({
      where: (a, { and, eq }) =>
        and(eq(a.email, email), eq(a.organizationId, organizationId)),
    })

    if (!existingAffiliate) {
      return {
        ok: true,
        message: "If the email exists, a reset link was sent.",
      }
    }

    const payload = {
      id: existingAffiliate.id,
      email: existingAffiliate.email,
      type: existingAffiliate.type,
      organizationId: existingAffiliate.organizationId,
      action: "reset-password",
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: "15m",
    })
    const baseUrl = await getBaseUrl()
    const resetUrl = buildAffiliateUrl({
      path: "reset-password",
      organizationId,
      token,
      baseUrl,
    })
    if (process.env.NODE_ENV === "development") {
      await sendVerificationEmail(existingAffiliate.email, resetUrl)
      return { ok: true, message: "Reset link sent to your email" }
    }
    return { ok: true, redirectUrl: resetUrl }
  })
}
