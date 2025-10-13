import React from "react"
import Signup from "@/components/pages/Signup"
import { redirectIfAuthed } from "@/lib/server/authGuards"

const signupPage = async () => {
  await redirectIfAuthed()
  return (
    <>
      <Signup affiliate={false} />
    </>
  )
}
export default signupPage
