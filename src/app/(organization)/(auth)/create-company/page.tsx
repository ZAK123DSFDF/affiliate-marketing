import React from "react"
import { redirect } from "next/navigation"
import { getOrganizationAuth } from "@/lib/server/getOrganizationAuth"
import CreateCompany from "@/components/pages/Create-Company"

const createCompanyPage = async () => {
  const decoded = await getOrganizationAuth()

  if (!decoded) {
    redirect("/login")
  }
  if (decoded.activeOrgId) {
    redirect(`/organization/${decoded.activeOrgId}/dashboard/analytics`)
  }

  if (decoded.orgIds && decoded.orgIds.length > 0) {
    redirect(`/organization/${decoded.orgIds[0]}/dashboard/analytics`)
  }
  return (
    <>
      <CreateCompany mode="create" />
    </>
  )
}
export default createCompanyPage
