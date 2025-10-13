import { redirect } from "next/navigation"
import EmailVerified from "@/components/pages/Email-verified"
import { getOrganizationAuth } from "@/lib/server/getOrganizationAuth"

export default async function EmailVerifiedPage() {
  const decoded = await getOrganizationAuth()
  if (!decoded) {
    redirect("/login")
  }
  return <EmailVerified orgId={decoded.activeOrgId} affiliate={false} />
}
