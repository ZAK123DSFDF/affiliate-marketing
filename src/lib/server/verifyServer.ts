"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
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
  let sessionPayload: any = null

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any

    sessionPayload = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role,
      orgId: decoded.organizationId || decoded.orgId,
    }

    if (mode === "signup") {
      if (tokenType === "seller") {
        await db
          .update(user)
          .set({ emailVerified: new Date() })
          .where(eq(user.id, sessionPayload.id))
      } else if (tokenType === "affiliate") {
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

    if (tokenType === "seller") {
      cookieStore.set("sellerToken", sessionToken, { httpOnly: true })
    }

    if (tokenType === "affiliate") {
      cookieStore.set("affiliateToken", sessionToken, { httpOnly: true })
    }

    // Redirect logic
    if (redirectUrl) {
      redirect(redirectUrl)
    } else if (tokenType === "seller") {
      redirect(`/email-verified`)
    } else if (tokenType === "affiliate") {
      redirect(`/affiliate/${sessionPayload.orgId}/email-verified`)
    }
  } catch (err) {
    console.error("Verify error:", err)
    if (tokenType === "seller") {
      redirect(`/invalid-token`)
    } else if (tokenType === "affiliate") {
      const orgId = sessionPayload?.orgId ?? "unknown"
      redirect(`/affiliate/${orgId}/invalid-token`)
    }
  }
}
