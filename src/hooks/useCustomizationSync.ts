"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAuthCustomization,
  getDashboardCustomization,
  getCustomizations,
} from "@/app/seller/[orgId]/dashboard/customization/action";
import {
  AuthCustomizationStores,
  DashboardCustomizationStores,
} from "@/store/useCustomizationStore";

type CustomizationType = "auth" | "dashboard" | "both";
export function useCustomizationSync(
  orgId?: string,
  type: CustomizationType = "both",
) {
  const query = useQuery({
    queryKey: ["customizations", type, orgId],
    queryFn: async () => {
      if (!orgId) return { auth: {}, dashboard: {} };
      if (type === "auth") {
        const auth = await getAuthCustomization(orgId);
        console.log("Fetched AUTH customization:", auth);
        return { auth, dashboard: {} };
      }
      if (type === "dashboard") {
        const dashboard = await getDashboardCustomization(orgId);
        return { auth: {}, dashboard };
      }
      // type === "both"
      return await getCustomizations(orgId);
    },
    enabled: !!orgId,
  });

  useEffect(() => {
    if (!query.data) return;

    const { auth, dashboard } = query.data;

    // Sync auth customizations if present
    if (auth && Object.keys(auth).length > 0) {
      Object.entries(auth).forEach(([storeName, storeValues]) => {
        const typedStoreName =
          storeName as keyof typeof AuthCustomizationStores;
        const store = AuthCustomizationStores[typedStoreName];
        if (store) {
          Object.entries(storeValues).forEach(([key, value]) => {
            if (typeof value === "string") {
              store.getState().setColor(key, value);
            } else {
              store.getState().setSwitch(key, value);
            }
          });
        }
      });
    }

    // Sync dashboard customizations if present
    if (dashboard && Object.keys(dashboard).length > 0) {
      Object.entries(dashboard).forEach(([storeName, storeValues]) => {
        const typedStoreName =
          storeName as keyof typeof DashboardCustomizationStores;
        const store = DashboardCustomizationStores[typedStoreName];
        if (store) {
          Object.entries(storeValues).forEach(([key, value]) => {
            if (typeof value === "string") {
              store.getState().setColor(key, value);
            } else {
              store.getState().setSwitch(key, value);
            }
          });
        }
      });
    }
  }, [query.data]);

  return query;
}
