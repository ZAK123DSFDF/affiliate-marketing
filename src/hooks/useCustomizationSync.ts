// hooks/useCustomizationSync.ts
"use client";

import { useEffect } from "react";
import {
  AuthCustomizationStores,
  DashboardCustomizationStores,
} from "@/store/useCustomizationStore";

interface SyncData {
  auth?: Record<string, any>;
  dashboard?: Record<string, any>;
}

export function useCustomizationSync(data: SyncData) {
  useEffect(() => {
    if (data.auth) {
      Object.entries(data.auth).forEach(([storeName, storeValues]) => {
        const typedStoreName =
          storeName as keyof typeof AuthCustomizationStores;
        const store = AuthCustomizationStores[typedStoreName];
        if (store) {
          Object.entries(storeValues).forEach(([key, value]) => {
            if (typeof value === "string")
              store.getState().setColor(key, value);
            else if (typeof value === "boolean")
              store.getState().setSwitch(key, value);
          });
        }
      });
    }

    if (data.dashboard) {
      Object.entries(data.dashboard).forEach(([storeName, storeValues]) => {
        const typedStoreName =
          storeName as keyof typeof DashboardCustomizationStores;
        const store = DashboardCustomizationStores[typedStoreName];
        if (store) {
          Object.entries(storeValues).forEach(([key, value]) => {
            if (typeof value === "string")
              store.getState().setColor(key, value);
            else if (typeof value === "boolean")
              store.getState().setSwitch(key, value);
          });
        }
      });
    }
  }, []);
}
