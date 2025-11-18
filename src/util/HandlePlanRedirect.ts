import { useRouter } from "next/navigation"

export const handlePlanRedirect = (
  orgId: string,
  router: ReturnType<typeof useRouter>
) => {
  router.push(`/organization/${orgId}/dashboard/pricing`)
}
