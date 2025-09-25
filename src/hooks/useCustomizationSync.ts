"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  getAuthCustomization,
  getDashboardCustomization,
  getCustomizations,
  AuthCustomization,
} from "@/app/(seller)/seller/[orgId]/dashboard/customization/action"
import { DashboardCustomizationStores } from "@/store/useCustomizationStore"
import {
  buttonCustomizationAtom,
  cardCustomizationAtom,
  checkboxCustomizationAtom,
  inputCustomizationAtom,
  notesCustomizationAtom,
  themeCustomizationAtom,
} from "@/store/AuthCustomizationAtom"
import { useSetAtom } from "jotai"

type CustomizationType = "auth" | "dashboard" | "both"
export function useCustomizationSync(
  orgId?: string,
  type: CustomizationType = "both"
) {
  const setCardCustomization = useSetAtom(cardCustomizationAtom)
  const setInputCustomization = useSetAtom(inputCustomizationAtom)
  const setCheckboxCustomization = useSetAtom(checkboxCustomizationAtom)
  const setButtonCustomization = useSetAtom(buttonCustomizationAtom)
  const setThemeCustomization = useSetAtom(themeCustomizationAtom)
  const setNotesCustomization = useSetAtom(notesCustomizationAtom)
  const query = useQuery({
    queryKey: ["customizations", type, orgId],
    queryFn: async () => {
      if (!orgId) return { auth: {}, dashboard: {} }
      if (type === "auth") {
        const auth = await getAuthCustomization(orgId)
        console.log("Fetched AUTH customization:", auth)
        return { auth, dashboard: {} }
      }
      if (type === "dashboard") {
        const dashboard = await getDashboardCustomization(orgId)
        return { auth: {}, dashboard }
      }
      // type === "both"
      return await getCustomizations(orgId)
    },
    enabled: !!orgId,
  })

  useEffect(() => {
    if (!query.data) return

    const { auth, dashboard } = query.data

    // Sync auth customizations if present
    if (auth && Object.keys(auth).length > 0) {
      const typedAuth = auth as Partial<AuthCustomization>

      if (typedAuth.useCardCustomization) {
        setCardCustomization(typedAuth.useCardCustomization)
      }
      if (typedAuth.useInputCustomization) {
        setInputCustomization(typedAuth.useInputCustomization)
      }
      if (typedAuth.useCheckboxCustomization) {
        setCheckboxCustomization(typedAuth.useCheckboxCustomization)
      }
      if (typedAuth.useButtonCustomization) {
        setButtonCustomization(typedAuth.useButtonCustomization)
      }
      if (typedAuth.useThemeCustomization) {
        setThemeCustomization(typedAuth.useThemeCustomization)
      }
      if (typedAuth.useNotesCustomization) {
        setNotesCustomization(typedAuth.useNotesCustomization)
      }
    }

    // Sync dashboard customizations if present
    if (dashboard && Object.keys(dashboard).length > 0) {
      Object.entries(dashboard).forEach(([storeName, storeValues]) => {
        const typedStoreName =
          storeName as keyof typeof DashboardCustomizationStores
        const store = DashboardCustomizationStores[typedStoreName]
        if (store) {
          Object.entries(storeValues).forEach(([key, value]) => {
            if (typeof value === "string") {
              store.getState().setColor(key, value)
            } else {
              store.getState().setSwitch(key, value)
            }
          })
        }
      })
    }
  }, [query.data])

  return query
}
