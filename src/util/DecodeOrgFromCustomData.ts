import jwt from "jsonwebtoken"

export function decodeOrgFromCustomData(customData: any) {
  if (!customData?.organizationToken) return null

  try {
    return jwt.verify(
      customData.organizationToken,
      process.env.SECRET_KEY!
    ) as { id: string; activeOrgId: string }
  } catch (err) {
    console.error("❌ Invalid organization token:", err)
    return null
  }
}
