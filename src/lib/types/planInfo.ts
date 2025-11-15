export interface PlanInfo {
  plan: "FREE" | "PRO" | "ULTIMATE"
  type: "FREE" | "SUBSCRIPTION" | "PURCHASE" | "EXPIRED"
  cycle?: "MONTHLY" | "YEARLY"
}
