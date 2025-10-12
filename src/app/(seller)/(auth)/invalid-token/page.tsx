import InvalidToken from "@/components/pages/InvalidToken"
import { redirectIfAuthed } from "@/lib/server/authGuards"

const InvalidTokenPage = async () => {
  await redirectIfAuthed()
  return (
    <>
      <InvalidToken affiliate={false} />
    </>
  )
}

export default InvalidTokenPage
