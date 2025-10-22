import { useAppMutation } from "@/hooks/useAppMutation"
import { switchOrganization } from "@/lib/server/switchOrganization"
import { useRouter } from "next/navigation"

export function useSwitchOrg() {
  const router = useRouter()

  return useAppMutation(
    async (orgId: string) => {
      return await switchOrganization(orgId)
    },
    {
      onSuccess: (res, orgId) => {
        if (res.ok) {
          router.push(`/organization/${orgId}/dashboard/analytics`)
        }
      },
    }
  )
}
