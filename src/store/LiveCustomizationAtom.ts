"use client"

import { atom, useAtomValue } from "jotai"
import {
  buttonCustomizationAtom,
  cardCustomizationAtom,
  checkboxCustomizationAtom,
  inputCustomizationAtom,
  notesCustomizationAtom,
  themeCustomizationAtom,
} from "@/store/AuthCustomizationAtom"
import {
  chartCustomizationAtom,
  dashboardButtonCustomizationAtom,
  dashboardCardCustomizationAtom,
  dashboardThemeCustomizationAtom,
  dialogCustomizationAtom,
  kpiCardCustomizationAtom,
  pieChartColorCustomizationAtom,
  sidebarCustomizationAtom,
  tableCustomizationAtom,
  toastCustomizationAtom,
  yearSelectCustomizationAtom,
} from "@/store/DashboardCustomizationAtom"

// Derived atom that combines auth + dashboard live states
const liveCustomizationsAtom = atom((get) => ({
  auth: {
    useCardCustomization: get(cardCustomizationAtom),
    useInputCustomization: get(inputCustomizationAtom),
    useCheckboxCustomization: get(checkboxCustomizationAtom),
    useButtonCustomization: get(buttonCustomizationAtom),
    useThemeCustomization: get(themeCustomizationAtom),
    useNotesCustomization: get(notesCustomizationAtom),
  },
  dashboard: {
    useSidebarCustomization: get(sidebarCustomizationAtom),
    useDashboardCardCustomization: get(dashboardCardCustomizationAtom),
    useDashboardThemeCustomization: get(dashboardThemeCustomizationAtom),
    useDashboardButtonCustomization: get(dashboardButtonCustomizationAtom),
    useTableCustomization: get(tableCustomizationAtom),
    useDialogCustomization: get(dialogCustomizationAtom),
    useYearSelectCustomization: get(yearSelectCustomizationAtom),
    useToastCustomization: get(toastCustomizationAtom),
    useKpiCardCustomization: get(kpiCardCustomizationAtom),
    useChartCustomization: get(chartCustomizationAtom),
    usePieChartColorCustomization: get(pieChartColorCustomizationAtom),
  },
}))

// React hook helper to get the live state easily
export const useLiveCustomizations = () => useAtomValue(liveCustomizationsAtom)
