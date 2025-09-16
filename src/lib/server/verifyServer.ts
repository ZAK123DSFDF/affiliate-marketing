"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { affiliate, user } from "@/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"

type VerifyServerProps = {
  token: string
  mode: "login" | "signup"
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
        await db
          .update(user)
          .set({ emailVerified: new Date() })
          .where(eq(user.id, sessionPayload.id))
      } else {
        await db
          .update(affiliate)
          .set({ emailVerified: new Date() })
          .where(eq(affiliate.id, sessionPayload.id))
      }
    }

    const cookieStore = await cookies()
    const sessionToken = jwt.sign(sessionPayload, process.env.SECRET_KEY!, {
      expiresIn: decoded.rememberMe ? "30d" : "1d",
    })

    cookieStore.set({
      name: tokenType === "seller" ? "sellerToken" : "affiliateToken",
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
