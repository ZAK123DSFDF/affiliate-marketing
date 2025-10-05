import React from "react"
import ForgotPassword from "@/components/pages/Forgot-password"
import { redirectIfAuthed } from "@/lib/server/authGuards"

const forgetPasswordPage = async () => {
  await redirectIfAuthed()
  return (
    <>
      <ForgotPassword affiliate={false} />
    </>
  )
}
export default forgetPasswordPage
