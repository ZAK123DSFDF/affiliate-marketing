import InvalidToken from "@/components/pages/InvalidToken"
import { redirectIfAuthed, redirectTeamIfAuthed } from "@/lib/server/authGuards"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"

const InvalidTokenPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectTeamIfAuthed(orgId)
  return (
    <>
      <InvalidToken affiliate={false} />
    </>
  )
}

export default InvalidTokenPage
