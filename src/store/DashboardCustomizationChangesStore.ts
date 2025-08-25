import { create } from "zustand"

type DashboardCustomizationChanges = Record<string, Record<string, any>>

interface DashboardCustomizationChangesState {
  changes: DashboardCustomizationChanges
  setChange: (storeKey: string, key: string, value: any) => void
  resetChanges: () => void
}

export const useDashboardCustomizationChangesStore =
  create<DashboardCustomizationChangesState>((set) => ({
    changes: {},
    setChange: (storeKey, key, value) =>
      set((state) => ({
        changes: {
          ...state.changes,
          [storeKey]: {
            ...state.changes[storeKey],
            [key]: value,
          },
        },
      })),
    resetChanges: () => set({ changes: {} }),
  }))
