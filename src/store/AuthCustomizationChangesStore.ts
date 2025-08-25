import { create } from "zustand"

type AuthCustomizationChanges = Record<string, Record<string, any>>

interface AuthCustomizationChangesState {
  changes: AuthCustomizationChanges
  setChange: (storeKey: string, key: string, value: any) => void
  resetChanges: () => void
}

export const useAuthCustomizationChangesStore =
  create<AuthCustomizationChangesState>((set) => ({
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
