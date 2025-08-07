import { create } from "zustand";
import { createCustomizationStore } from "@/store/CreateCustomizationStore";

export const useSidebarCustomization = createCustomizationStore(
  {
    sideBarBackgroundColor: "",
    sideBarActiveNavigationTextColor: "",
    sideBarInActiveNavigationTextColor: "",
    sideBarActiveNavigationBackgroundColor: "",
    sideBarHoverNavigationBackgroundColor: "",
    sideBarHoverNavigationTextColor: "",
    sideBarProfileBackgroundColor: "",
    sideBarProfileTextPrimaryColor: "",
    sideBarProfileTextSecondaryColor: "",
    sideBarNavigationFocusRingColor: "",
  },
  {},
  {},
);
export const useDashboardCardCustomization = createCustomizationStore(
  {
    dashboardCardShadowThickness: "sm",
    dashboardCardBorderColor: "",
    dashboardCardBackgroundColor: "",
    dashboardCardShadowColor: "",
  },
  { dashboardCardBorder: false, dashboardCardShadow: false },
  {},
);
export const useDashboardThemeCustomization = createCustomizationStore(
  {
    mainBackgroundColor: "",
    separatorColor: "",
    dashboardHeaderNameColor: "",
    dashboardHeaderDescColor: "",
    cardHeaderPrimaryTextColor: "",
    cardHeaderSecondaryTextColor: "",
    dialogHeaderColor: "",
  },
  {},
  {},
);
export const useDashboardButtonCustomization = createCustomizationStore(
  {
    dashboardButtonBackgroundColor: "",
    dashboardButtonTextColor: "",
    dashboardButtonDisabledBackgroundColor: "",
    dashboardButtonDisabledTextColor: "",
  },
  {},
  {},
);
export const useTableCustomization = createCustomizationStore(
  {
    tableHeaderTextColor: "",
    tableHoverBackgroundColor: "",
    tableIconColor: "",
    tableIconHoverColor: "",
    tableIconHoverBackgroundColor: "",
    tableRowPrimaryTextColor: "",
    tableRowSecondaryTextColor: "",
    tableRowTertiaryTextColor: "",
    tableRowBadgeOverDueTextColor: "",
    tableRowBadgeOverDueBackgroundColor: "",
    tableRowBadgePendingTextColor: "",
    tableRowBadgePendingBackgroundColor: "",
    tableRowBadgePaidTextColor: "",
    tableRowBadgePaidBackgroundColor: "",
    tableBorderColor: "",
  },
  {},
  {},
);
export const useDialogCustomization = createCustomizationStore(
  {
    dialogBackgroundColor: "",
    dialogCloseIconColor: "",
    dialogCloseIconBorderColor: "",
  },
  {},
  {},
);
export const useYearSelectCustomization = createCustomizationStore(
  {
    yearSelectBackgroundColor: "",
    yearSelectTextColor: "",
    yearSelectActiveBorderColor: "",
    yearSelectDropDownBackgroundColor: "",
    yearSelectDropDownTextColor: "",
    yearSelectDropDownActiveTextColor: "",
    yearSelectDropDownActiveBackgroundColor: "",
    yearSelectDropDownIconColor: "",
    yearSelectDropDownHoverBackgroundColor: "",
    yearSelectDropDownHoverTextColor: "",
  },
  {},
  {},
);
export const useToastCustomization = createCustomizationStore(
  {
    toastBackgroundColor: "",
    toastTitleColor: "",
    toastDescriptionColor: "",
    toastErrorBackgroundColor: "",
    toastErrorTitleColor: "",
    toastErrorDescriptionColor: "",
  },
  {},
  {},
);
