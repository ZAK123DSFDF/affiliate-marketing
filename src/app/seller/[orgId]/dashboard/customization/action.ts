"use server";
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization";
import { defaultAuthCustomization } from "@/customization/Auth/defaultAuthCustomization";

type AuthCustomization = typeof defaultAuthCustomization;
type DashboardCustomization = typeof defaultDashboardCustomization;
export async function saveCustomizationsAction(data: {
  auth?: Partial<AuthCustomization>;
  dashboard?: Partial<DashboardCustomization>;
}) {
  console.log("🔹 Received customization data:", data);
  if (data.auth) {
    console.log("📦 Saving Auth Customizations:", data.auth);
  }
  if (data.dashboard) {
    console.log("📦 Saving Dashboard Customizations:", data.dashboard);
  }

  return { success: true };
}
