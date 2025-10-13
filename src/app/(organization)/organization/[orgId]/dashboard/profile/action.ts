// app/actions/auth/getUser.ts
"use server"
import { db } from "@/db/drizzle"
import { account, user } from "@/db/schema"
import { eq } from "drizzle-orm"
import { returnError } from "@/lib/errorHandler"
import * as bcrypt from "bcrypt"
import { ResponseData } from "@/lib/types/response"
import { SafeUserWithCapabilities } from "@/lib/types/authUser"
import { revalidatePath } from "next/cache"
import { getUserAuthCapabilities } from "@/lib/server/getUserAuthCapabilities"
import { getCurrentUser } from "@/lib/server/getCurrentUser"

export const getUserData = async (): Promise<
  ResponseData<SafeUserWithCapabilities>
> => {
  try {
    const { userId, canChangePassword, canChangeEmail } =
      await getUserAuthCapabilities()

    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    })

    if (!userData) {
      throw {
        status: 404,
        error: "User not found",
        toast: "Your account could not be found.",
      }
    }

    return {
      ok: true,
      data: {
        ...userData,
        canChangeEmail,
        canChangePassword,
      },
    }
  } catch (err) {
    console.error("getUserData error:", err)
    return returnError(err) as ResponseData<SafeUserWithCapabilities>
  }
}
export async function updateUserProfile(
  orgId: string,
  data: { name?: string }
) {
  try {
    const { id } = await getCurrentUser()
    if (!id) throw { status: 401, toast: "Unauthorized" }
    if (!data.name) return { ok: true }

    await db.update(user).set({ name: data.name }).where(eq(user.id, id))
    revalidatePath(`/organization/${orgId}/dashboard/profile`)
    return { ok: true }
  } catch (err) {
    console.error("updateUserProfile error:", err)
    return returnError(err)
  }
}

export async function validateCurrentOrganizationPassword(
  currentPassword: string
) {
  try {
    const { id } = await getCurrentUser()
    if (!id) throw { status: 401, toast: "Unauthorized" }

    // Get account by userId
    const record = await db.query.account.findFirst({
      where: eq(account.userId, id),
    })
    if (!record || !record.password) {
      throw { status: 404, toast: "Account not found" }
    }

    const isMatch = await bcrypt.compare(currentPassword, record.password)
    if (!isMatch) {
      throw { status: 403, toast: "Incorrect current password" }
    }

    return { ok: true }
  } catch (err) {
    console.error("validateCurrentOrganizationPassword error:", err)
    return returnError(err)
  }
}
export async function updateUserPassword(newPassword: string) {
  try {
    const { userId, canChangePassword } = await getUserAuthCapabilities()

    if (!canChangePassword) {
      throw { status: 403, toast: "This account cannot change password" }
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    const result = await db
      .update(account)
      .set({ password: hashed })
      .where(eq(account.userId, userId))
      .returning()

    if (!result.length) {
      throw { status: 404, toast: "Account not found" }
    }

    return { ok: true }
  } catch (err) {
    console.error("updateUserPassword error:", err)
    return returnError(err)
  }
}
