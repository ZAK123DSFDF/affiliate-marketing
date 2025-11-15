export type PlanTier = "PRO" | "ULTIMATE"
export type Cycle = "MONTHLY" | "YEARLY"

export function getSubscriptionChangeMode(
  currentTier: PlanTier,
  currentCycle: Cycle,
  targetTier: PlanTier,
  targetCycle: Cycle
): "PRORATE" | "DO_NOT_BILL" {
  // 🟢 1. Change between monthly ↔ yearly (same plan)
  if (currentTier === targetTier && currentCycle !== targetCycle) {
    return "PRORATE"
  }

  // 🟢 2. Upgrade: PRO → ULTIMATE
  if (currentTier === "PRO" && targetTier === "ULTIMATE") {
    return "PRORATE"
  }

  // 🔴 3. Downgrade: ULTIMATE → PRO
  if (currentTier === "ULTIMATE" && targetTier === "PRO") {
    return "DO_NOT_BILL"
  }

  // fallback (should not happen)
  return "PRORATE"
}
