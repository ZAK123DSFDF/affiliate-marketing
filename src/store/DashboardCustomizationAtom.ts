"use client"

import { atom } from "jotai"
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization"

// infer types directly from slices of defaultDashboardCustomization
export type SidebarCustomization =
  typeof defaultDashboardCustomization.useSidebarCustomization
export type DashboardCardCustomization =
  typeof defaultDashboardCustomization.useDashboardCardCustomization
export type DashboardThemeCustomization =
  typeof defaultDashboardCustomization.useDashboardThemeCustomization
export type DashboardButtonCustomization =
  typeof defaultDashboardCustomization.useDashboardButtonCustomization
export type TableCustomization =
  typeof defaultDashboardCustomization.useTableCustomization
export type DialogCustomization =
  typeof defaultDashboardCustomization.useDialogCustomization
export type YearSelectCustomization =
  typeof defaultDashboardCustomization.useYearSelectCustomization
export type ToastCustomization =
  typeof defaultDashboardCustomization.useToastCustomization
export type KpiCardCustomization =
  typeof defaultDashboardCustomization.useKpiCardCustomization
export type ChartCustomization =
  typeof defaultDashboardCustomization.useChartCustomization
export type PieChartColorCustomization =
  typeof defaultDashboardCustomization.usePieChartColorCustomization
export type LogoutButtonCustomization =
  typeof defaultDashboardCustomization.useLogoutButtonCustomization
// atoms for each slice, fully typed
export const sidebarCustomizationAtom = atom<SidebarCustomization>(
  defaultDashboardCustomization.useSidebarCustomization
)

export const dashboardCardCustomizationAtom = atom<DashboardCardCustomization>(
  defaultDashboardCustomization.useDashboardCardCustomization
)

export const dashboardThemeCustomizationAtom =
  atom<DashboardThemeCustomization>(
    defaultDashboardCustomization.useDashboardThemeCustomization
  )

export const dashboardButtonCustomizationAtom =
  atom<DashboardButtonCustomization>(
    defaultDashboardCustomization.useDashboardButtonCustomization
  )

export const tableCustomizationAtom = atom<TableCustomization>(
  defaultDashboardCustomization.useTableCustomization
)

export const dialogCustomizationAtom = atom<DialogCustomization>(
  defaultDashboardCustomization.useDialogCustomization
)

export const yearSelectCustomizationAtom = atom<YearSelectCustomization>(
  defaultDashboardCustomization.useYearSelectCustomization
)

export const toastCustomizationAtom = atom<ToastCustomization>(
  defaultDashboardCustomization.useToastCustomization
)

export const kpiCardCustomizationAtom = atom<KpiCardCustomization>(
  defaultDashboardCustomization.useKpiCardCustomization
)

export const chartCustomizationAtom = atom<ChartCustomization>(
  defaultDashboardCustomization.useChartCustomization
)

export const pieChartColorCustomizationAtom = atom<PieChartColorCustomization>(
  defaultDashboardCustomization.usePieChartColorCustomization
)

export const logoutButtonCustomizationAtom = atom<LogoutButtonCustomization>(
  defaultDashboardCustomization.useLogoutButtonCustomization
)
