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

export const VerifyServer = async ({
  token,
  mode,
  redirectUrl,
}: VerifyServerProps) => {
  let tokenType: "seller" | "affiliate" = "seller"
  let orgId: string | undefined = undefined
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any

    tokenType = (decoded.type as string).toLowerCase() as "seller" | "affiliate"
    orgId = decoded.organizationId || decoded.orgId || null
    const sessionPayload = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role,
      orgId,
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
      expires: decoded.rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : undefined,
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
      orgId,
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
