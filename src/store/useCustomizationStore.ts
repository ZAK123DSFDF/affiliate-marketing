import { createStoresFromDefaults } from "@/customization/createStoresFromDefaults";
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization";
import { customizationConfig } from "@/customization/customizationConfig";
import { defaultAuthCustomization } from "@/customization/Auth/defaultAuthCustomization";

export const DashboardCustomizationStores = createStoresFromDefaults(
  defaultDashboardCustomization,
  customizationConfig,
);
export const AuthCustomizationStores = createStoresFromDefaults(
  defaultAuthCustomization,
  customizationConfig,
);
