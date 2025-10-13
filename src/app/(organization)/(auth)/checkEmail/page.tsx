import React from "react"
import CheckEmail from "@/components/pages/CheckEmail"
import { redirectIfAuthed } from "@/lib/server/authGuards"

const CheckEmailPage = async () => {
  await redirectIfAuthed()
  return (
    <>
      <CheckEmail affiliate={false} />
    </>
  )
}
export default CheckEmailPage
