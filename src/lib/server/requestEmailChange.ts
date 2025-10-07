"use server"

import jwt from "jsonwebtoken"
import { sendVerificationEmail } from "@/lib/mail"
import { returnError } from "@/lib/errorHandler"
import { getSellerOrgContext } from "@/lib/server/getSellerOrgContext"
import { redirect } from "next/navigation"

// ------------------- SELLER -------------------
export const requestSellerEmailChange = async ({
  userId,
  newEmail,
}: {
  userId: string
  newEmail: string
}) => {
  try {
    if (!newEmail) throw { status: 400, error: "New email required" }

    const { orgIds, activeOrgId, role, type } = await getSellerOrgContext()
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
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email-change?sellerToken=${token}`
    if (process.env.NODE_ENV === "development") {
      await sendVerificationEmail(newEmail, verifyUrl)
      return { ok: true, message: "Verification link sent to new email" }
    }
    redirect(verifyUrl)
  } catch (err) {
    console.error("requestSellerEmailChange error:", err)
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
    if (!newEmail) throw { status: 400, error: "New email required" }

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

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/affiliate/${orgId}/verify-email-change?affiliateToken=${token}`
    if (process.env.NODE_ENV === "development") {
      await sendVerificationEmail(newEmail, verifyUrl)
      return { ok: true, message: "Verification link sent to new email" }
    }
    redirect(verifyUrl)
  } catch (err) {
    console.error("requestAffiliateEmailChange error:", err)
    return returnError(err)
  }
}
