import { redirect } from "next/navigation"
import EmailVerified from "@/components/pages/Email-verified"
import { getSellerAuth } from "@/lib/server/getSellerAuth"

export default async function EmailVerifiedPage() {
  const decoded = await getSellerAuth()

  if (!decoded) {
    redirect("/login")
  }
  console.log("this is decoded", decoded)
  return <EmailVerified orgId={decoded.activeOrgId} affiliate={false} />
}
