import { useAuthCustomizationChangesStore } from "@/store/AuthCustomizationChangesStore"
import { AuthCustomizationStores } from "@/store/useCustomizationStore"
import { defaultAuthCustomization } from "@/customization/Auth/defaultAuthCustomization"

type AuthCustomizationStoreKey = keyof typeof defaultAuthCustomization

export function updateAuthCustomization<
  T extends AuthCustomizationStoreKey,
  K extends keyof (typeof defaultAuthCustomization)[T],
>(storeKey: T, key: K, value: (typeof defaultAuthCustomization)[T][K]) {
  const store = AuthCustomizationStores[storeKey]
  if (!store) return

  type StoreState = ReturnType<typeof store.getState>
  console.log("Updating auth customization:", { storeKey, key, value })
  store.setState(
    () =>
      ({
        [key]: value,
      }) as Partial<StoreState>
  )

  const changesStore = useAuthCustomizationChangesStore.getState()
  changesStore.setChange(storeKey, key as string, value)
}

export function getAuthCustomizationChanges() {
  return useAuthCustomizationChangesStore.getState().changes
}
