"use client"

import { atom } from "jotai"
import equal from "fast-deep-equal"
import {
  ChartCustomization,
  chartCustomizationAtom,
  DashboardButtonCustomization,
  dashboardButtonCustomizationAtom,
  DashboardCardCustomization,
  dashboardCardCustomizationAtom,
  DashboardThemeCustomization,
  dashboardThemeCustomizationAtom,
  DialogCustomization,
  dialogCustomizationAtom,
  KpiCardCustomization,
  kpiCardCustomizationAtom,
  LogoutButtonCustomization,
  logoutButtonCustomizationAtom,
  PieChartColorCustomization,
  pieChartColorCustomizationAtom,
  SidebarCustomization,
  sidebarCustomizationAtom,
  TableCustomization,
  tableCustomizationAtom,
  ToastCustomization,
  toastCustomizationAtom,
  YearSelectCustomization,
  yearSelectCustomizationAtom,
} from "@/store/DashboardCustomizationAtom"

// Initial values
export const initialSidebarCustomizationAtom =
  atom<SidebarCustomization | null>(null)
export const initialDashboardCardCustomizationAtom =
  atom<DashboardCardCustomization | null>(null)
export const initialDashboardThemeCustomizationAtom =
  atom<DashboardThemeCustomization | null>(null)
export const initialDashboardButtonCustomizationAtom =
  atom<DashboardButtonCustomization | null>(null)
export const initialTableCustomizationAtom = atom<TableCustomization | null>(
  null
)
export const initialDialogCustomizationAtom = atom<DialogCustomization | null>(
  null
)
export const initialYearSelectCustomizationAtom =
  atom<YearSelectCustomization | null>(null)
export const initialToastCustomizationAtom = atom<ToastCustomization | null>(
  null
)
export const initialKpiCardCustomizationAtom =
  atom<KpiCardCustomization | null>(null)
export const initialChartCustomizationAtom = atom<ChartCustomization | null>(
  null
)
export const initialPieChartColorCustomizationAtom =
  atom<PieChartColorCustomization | null>(null)
export const initialLogoutButtonCustomizationAtom =
  atom<LogoutButtonCustomization | null>(null)

// Derived atom: true if *any* dashboard customization differs
export const dashboardHasChangesAtom = atom((get) => {
  const pairs: [any, any][] = [
    [get(sidebarCustomizationAtom), get(initialSidebarCustomizationAtom)],
    [
      get(dashboardCardCustomizationAtom),
      get(initialDashboardCardCustomizationAtom),
    ],
    [
      get(dashboardThemeCustomizationAtom),
      get(initialDashboardThemeCustomizationAtom),
    ],
    [
      get(dashboardButtonCustomizationAtom),
      get(initialDashboardButtonCustomizationAtom),
    ],
    [get(tableCustomizationAtom), get(initialTableCustomizationAtom)],
    [get(dialogCustomizationAtom), get(initialDialogCustomizationAtom)],
    [get(yearSelectCustomizationAtom), get(initialYearSelectCustomizationAtom)],
    [get(toastCustomizationAtom), get(initialToastCustomizationAtom)],
    [get(kpiCardCustomizationAtom), get(initialKpiCardCustomizationAtom)],
    [get(chartCustomizationAtom), get(initialChartCustomizationAtom)],
    [
      get(pieChartColorCustomizationAtom),
      get(initialPieChartColorCustomizationAtom),
    ],
    [
      get(logoutButtonCustomizationAtom),
      get(initialLogoutButtonCustomizationAtom),
    ],
  ]

  return pairs.some(
    ([current, initial]) => initial !== null && !equal(current, initial)
  )
})
