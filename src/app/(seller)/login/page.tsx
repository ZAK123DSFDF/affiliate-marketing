import React from "react"
import Login from "@/components/pages/Login"
import { redirectIfAuthed } from "@/lib/server/authGuards"

const loginPage = async () => {
  await redirectIfAuthed()
  return (
    <>
      <Login affiliate={false} />
    </>
  )
}
export default loginPage
