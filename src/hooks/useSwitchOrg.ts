import { useMutation } from "@tanstack/react-query"
import { switchOrganization } from "@/lib/server/switchOrganization"
import { useRouter } from "next/navigation"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"

export function useSwitchOrg() {
  const router = useRouter()
  const { showCustomToast } = useCustomToast()

  return useMutation({
    mutationFn: async (orgId: string) => {
      return await switchOrganization(orgId)
    },
    onSuccess: (res, orgId) => {
      if (res.ok) {
        router.push(`/seller/${orgId}/dashboard/analytics`)
      } else {
        showCustomToast({
          type: "error",
          title: "Switch failed",
          description: "Could not switch organization",
          affiliate: false,
        })
      }
    },
    onError: (err: any) => {
      showCustomToast({
        type: "error",
        title: "Server error",
        description: err.message || "Something went wrong",
        affiliate: false,
      })
    },
  })
}
