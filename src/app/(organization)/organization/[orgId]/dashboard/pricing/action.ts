"use server"
import { handleAction } from "@/lib/handleAction"
import type { MutationData } from "@/lib/types/response"
import { updatePlan } from "@/lib/server/updatePlan"

export async function updateSubscriptionAction({
  subscriptionId,
  targetPlan,
  targetCycle,
  mode,
  modeType,
}: {
  subscriptionId: string
  targetPlan: "PRO" | "ULTIMATE"
  targetCycle: "MONTHLY" | "YEARLY"
  mode: "PRORATE" | "DO_NOT_BILL"
  modeType: "SUB_TO_SUB" | "SUB_TO_ONE_TIME"
}): Promise<MutationData> {
  return handleAction("updateSubscriptionAction", async () => {
    if (!subscriptionId) throw { status: 400, toast: "Invalid subscription" }

    await updatePlan({
      subscriptionId,
      targetPlan,
      targetCycle,
      mode,
      modeType,
    })

    return {
      ok: true,
      toast: "Subscription updated successfully",
    }
  })
}
