"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { account, affiliate, affiliateAccount, user } from "@/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"

type VerifyServerProps = {
  token: string
  mode: "login" | "signup" | "changeEmail"
  redirectUrl?: string
}

type SessionPayload = {
  id: string
  email: string
  type: string
  role: string
  orgIds?: string[]
  activeOrgId?: string
  orgId?: string
}
export const VerifyServer = async ({
  token,
  mode,
  redirectUrl,
}: VerifyServerProps) => {
  let tokenType: "seller" | "affiliate" = "seller"
  let orgIds: string[] = []
  let activeOrgId: string | undefined
  let orgId: string | undefined
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any

    tokenType = (decoded.type as string).toLowerCase() as "seller" | "affiliate"
    orgIds = decoded.orgIds || []
    activeOrgId = decoded.activeOrgId
    orgId = decoded.orgId || decoded.organizationId
    const sessionPayload: SessionPayload = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role,
      orgIds: decoded.orgIds || [],
      activeOrgId: decoded.activeOrgId || undefined,
      orgId: decoded.orgId || decoded.organizationId || undefined,
    }
    if (tokenType === "seller") {
      sessionPayload.orgIds = orgIds
      sessionPayload.activeOrgId = activeOrgId
    } else {
      sessionPayload.orgId = orgId
    }
    if (mode === "signup") {
      if (tokenType === "seller") {
        const userAccount = await db.query.account.findFirst({
          where: (a, { and, eq }) =>
            and(eq(a.userId, sessionPayload.id), eq(a.provider, "credentials")),
        })
        if (userAccount) {
          await db
            .update(account)
            .set({ emailVerified: new Date() })
            .where(eq(account.id, userAccount.id))
        }
      } else {
        const affiliateAcc = await db.query.affiliateAccount.findFirst({
          where: (aa, { and, eq }) =>
            and(
              eq(aa.affiliateId, sessionPayload.id),
              eq(aa.provider, "credentials")
            ),
        })
        if (affiliateAcc) {
          await db
            .update(affiliateAccount)
            .set({ emailVerified: new Date() })
            .where(eq(affiliateAccount.id, affiliateAcc.id))
        }
      }
    }

    if (mode === "changeEmail") {
      const newEmail = decoded.newEmail
      if (!newEmail) throw new Error("Missing new email in token")

      if (tokenType === "seller") {
        await db
          .update(user)
          .set({ email: newEmail })
          .where(eq(user.id, decoded.id))
      } else {
        await db
          .update(affiliate)
          .set({ email: newEmail })
          .where(eq(affiliate.id, decoded.id))
      }

      // overwrite payload with new email
      sessionPayload.email = newEmail
    }

    const cookieStore = await cookies()
    const sessionToken = jwt.sign(sessionPayload, process.env.SECRET_KEY!, {
      expiresIn: decoded.rememberMe ? "30d" : "1d",
    })

    cookieStore.set({
      name:
        tokenType === "seller"
          ? "sellerToken"
          : `affiliateToken-${sessionPayload.orgId}`,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: decoded.rememberMe ? 30 * 24 * 60 * 60 : undefined,
    })
    return {
      success: true,
      redirectUrl:
        redirectUrl ||
        (tokenType === "seller"
          ? "/email-verified"
          : `/affiliate/${sessionPayload.orgId}/email-verified`),
      mode,
      tokenType,
      orgIds,
      activeOrgId:
        tokenType === "seller"
          ? sessionPayload.activeOrgId
          : sessionPayload.orgId,
    }
  } catch (err) {
    console.error("Verify error:", err)
    return {
      success: false,
      redirectUrl:
        tokenType === "seller"
          ? "/invalid-token"
          : orgId
            ? `/affiliate/${orgId}/invalid-token`
            : `affiliate/unknown`,
    }
  }
}
