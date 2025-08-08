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
    cardHeaderDescriptionTextColor: "",
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

export const useKpiCardCustomization = createCustomizationStore(
  {
    cardShadowColor: "",
    cardBorderColor: "",
    cardPrimaryTextColor: "",
    cardSecondaryTextColor: "",
    cardIconPrimaryColor: "",
    cardIconSecondaryColor: "",
    cardIconTertiaryColor: "",
    cardIconPrimaryBackgroundColor: "",
    cardIconSecondaryBackgroundColor: "",
    cardIconTertiaryBackgroundColor: "",
    cardShadowThickness: "sm",
    cardBackgroundColor: "",
  },
  {
    cardShadow: true,
    cardBorder: true,
  },
  {},
);
export const useChartCustomization = createCustomizationStore(
  {
    chartHorizontalLineColor: "",
    chartDateColor: "",
    chartPrimaryColor: "",
    chartSecondaryColor: "",
    chartTertiaryColor: "",
    chartFourthColor: "",
    chartLegendTextColor: "",
    toolTipChartDateColor: "",
    toolTipBackgroundColor: "",
    toolTipTextColor: "",
    toolTipNumberColor: "",
  },
  {},
  {},
);
export const usePieChartColorCustomization = createCustomizationStore(
  {
    pieColor1: "",
    pieColor2: "",
    pieColor3: "",
    pieColor4: "",
    pieColor5: "",
    pieColor6: "",
    pieColor7: "",
    pieColor8: "",
    pieFallbackColor: "",
  },
  {},
  {},
);
