import { useDashboardCustomizationChangesStore } from "@/store/DashboardCustomizationChangesStore";
import { DashboardCustomizationStores } from "@/store/useCustomizationStore";
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization";

type DashboardCustomizationStoreKey =
  keyof typeof defaultDashboardCustomization;

export function updateDashboardCustomization<
  T extends DashboardCustomizationStoreKey,
  K extends keyof (typeof defaultDashboardCustomization)[T],
>(storeKey: T, key: K, value: (typeof defaultDashboardCustomization)[T][K]) {
  const store = DashboardCustomizationStores[storeKey];
  if (!store) return;

  type StoreState = ReturnType<typeof store.getState>;

  store.setState(
    () =>
      ({
        [key]: value,
      }) as Partial<StoreState>,
  );

  const changesStore = useDashboardCustomizationChangesStore.getState();
  changesStore.setChange(storeKey, key as string, value);
}

export function getDashboardCustomizationChanges() {
  return useDashboardCustomizationChangesStore.getState().changes;
}
