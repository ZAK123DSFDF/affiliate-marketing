"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { affiliate, user } from "@/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"

type VerifyServerProps = {
  token: string
  tokenType: "affiliate" | "seller"
  mode: "login" | "signup"
  redirectUrl?: string
}

export const VerifyServer = async ({
  token,
  tokenType,
  mode,
  redirectUrl,
}: VerifyServerProps) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any

    const sessionPayload = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role,
      orgId: decoded.organizationId || decoded.orgId,
    }

    // Email verification on signup
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
      expiresIn: "7d",
    })

    cookieStore.set({
      name: tokenType === "seller" ? "sellerToken" : "affiliateToken",
      value: sessionToken,
      httpOnly: true,
    })

    // ✅ return instead of redirect
    return {
      success: true,
      redirectUrl:
        redirectUrl ||
        (tokenType === "seller"
          ? "/email-verified"
          : `/affiliate/${sessionPayload.orgId}/email-verified`),
    }
  } catch (err) {
    console.error("Verify error:", err)
    return {
      success: false,
      redirectUrl:
        tokenType === "seller"
          ? "/invalid-token"
          : `/affiliate/${"unknown"}/invalid-token`,
    }
  }
}
