import React from "react"
import EmailVerified from "@/components/pages/Email-verified"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
const emailVerifiedPage = async () => {
  const cookieStore = await cookies()
  const sellerToken = cookieStore.get("sellerToken")?.value

  let orgId: string | undefined = undefined
  if (sellerToken) {
    try {
      const decoded: any = jwt.verify(sellerToken, process.env.SECRET_KEY!)
      orgId = decoded.orgId
    } catch (err) {
      console.error("Failed to decode seller token", err)
    }
  }
  return (
    <>
      <EmailVerified orgId={orgId} affiliate={false} />
    </>
  )
}
export default emailVerifiedPage
