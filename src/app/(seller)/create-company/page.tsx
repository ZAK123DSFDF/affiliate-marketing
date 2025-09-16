import React from "react"
import CreateCompany from "@/components/pages/Create-Company"
import { redirect } from "next/navigation"
import { getSellerAuth } from "@/lib/server/getSellerAuth"

const createCompanyPage = async () => {
  const decoded = await getSellerAuth()

  if (!decoded) {
    redirect("/login")
  }
  if (decoded.activeOrgId) {
    redirect(`/seller/${decoded.activeOrgId}/dashboard/analytics`)
  }

  if (decoded.orgIds && decoded.orgIds.length > 0) {
    redirect(`/seller/${decoded.orgIds[0]}/dashboard/analytics`)
  }
  return (
    <>
      <CreateCompany mode="create" />
    </>
  )
}
export default createCompanyPage
