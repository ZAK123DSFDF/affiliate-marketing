import React from "react"
import CreateCompany from "@/components/pages/Create-Company"
import { redirect } from "next/navigation"
import { getSellerAuth } from "@/lib/server/getSellerAuth"

const createCompanyPage = async () => {
  const decoded = await getSellerAuth()

  if (!decoded) {
    redirect("/login")
  }

  if (decoded.orgId) {
    redirect(`/seller/${decoded.orgId}/dashboard/analytics`)
  }
  return (
    <>
      <CreateCompany />
    </>
  )
}
export default createCompanyPage
