import React from "react"
import Signup from "@/components/pages/Signup"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"

const signupPage = async () => {
  return (
    <>
      <Signup affiliate={false} />
    </>
  )
}
export default signupPage
