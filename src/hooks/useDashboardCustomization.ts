import { DashboardCustomizationStores } from "@/store/useCustomizationStore";

export const useSidebarCustomizationOption = () => {
  const sideBarBackgroundColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarBackgroundColor,
    );
  const sideBarActiveNavigationTextColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarActiveNavigationTextColor,
    );
  const sideBarInActiveNavigationTextColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarInActiveNavigationTextColor,
    );
  const sideBarActiveNavigationBackgroundColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarActiveNavigationBackgroundColor,
    );
  const sideBarHoverNavigationBackgroundColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarHoverNavigationBackgroundColor,
    );
  const sideBarHoverNavigationTextColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarHoverNavigationTextColor,
    );
  const sideBarProfileBackgroundColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarProfileBackgroundColor,
    );
  const sideBarProfileTextPrimaryColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarProfileTextPrimaryColor,
    );
  const sideBarProfileTextSecondaryColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarProfileTextSecondaryColor,
    );
  const sideBarNavigationFocusRingColor =
    DashboardCustomizationStores.useSidebarCustomization(
      (s) => s.sideBarNavigationFocusRingColor,
    );
  const setSidebarColor = DashboardCustomizationStores.useSidebarCustomization(
    (s) => s.setColor,
  );

  return {
    sideBarBackgroundColor,
    sideBarActiveNavigationTextColor,
    sideBarInActiveNavigationTextColor,
    sideBarActiveNavigationBackgroundColor,
    sideBarHoverNavigationBackgroundColor,
    sideBarHoverNavigationTextColor,
    sideBarProfileBackgroundColor,
    sideBarProfileTextPrimaryColor,
    sideBarProfileTextSecondaryColor,
    sideBarNavigationFocusRingColor,
    setSidebarColor,
  };
};
export const useDashboardCardCustomizationOption = () => {
  const dashboardCardShadowThickness =
    DashboardCustomizationStores.useDashboardCardCustomization(
      (s) => s.dashboardCardShadowThickness,
    );
  const dashboardCardBorderColor =
    DashboardCustomizationStores.useDashboardCardCustomization(
      (s) => s.dashboardCardBorderColor,
    );
  const dashboardCardBackgroundColor =
    DashboardCustomizationStores.useDashboardCardCustomization(
      (s) => s.dashboardCardBackgroundColor,
    );
  const dashboardCardShadowColor =
    DashboardCustomizationStores.useDashboardCardCustomization(
      (s) => s.dashboardCardShadowColor,
    );

  const dashboardCardBorder =
    DashboardCustomizationStores.useDashboardCardCustomization(
      (s) => s.dashboardCardBorder,
    );
  const dashboardCardShadow =
    DashboardCustomizationStores.useDashboardCardCustomization(
      (s) => s.dashboardCardShadow,
    );

  const setDashboardCardColor =
    DashboardCustomizationStores.useDashboardCardCustomization(
      (s) => s.setColor,
    );
  const setDashboardCardSwitch =
    DashboardCustomizationStores.useDashboardCardCustomization(
      (s) => s.setSwitch,
    );

  return {
    dashboardCardShadowThickness,
    dashboardCardBorderColor,
    dashboardCardBackgroundColor,
    dashboardCardShadowColor,
    dashboardCardBorder,
    dashboardCardShadow,
    setDashboardCardColor,
    setDashboardCardSwitch,
  };
};
export const useDashboardThemeCustomizationOption = () => {
  const separatorColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.separatorColor,
    );
  const mainBackgroundColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.mainBackgroundColor,
    );
  const dashboardHeaderNameColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.dashboardHeaderNameColor,
    );
  const dashboardHeaderDescColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.dashboardHeaderDescColor,
    );
  const cardHeaderPrimaryTextColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.cardHeaderPrimaryTextColor,
    );
  const cardHeaderSecondaryTextColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.cardHeaderSecondaryTextColor,
    );
  const dialogHeaderColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.dialogHeaderColor,
    );
  const cardHeaderDescriptionTextColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.cardHeaderDescriptionTextColor,
    );
  const setDashboardThemeColor =
    DashboardCustomizationStores.useDashboardThemeCustomization(
      (s) => s.setColor,
    );

  return {
    mainBackgroundColor,
    dashboardHeaderNameColor,
    dashboardHeaderDescColor,
    setDashboardThemeColor,
    separatorColor,
    dialogHeaderColor,
    cardHeaderPrimaryTextColor,
    cardHeaderDescriptionTextColor,
    cardHeaderSecondaryTextColor,
  };
};
export const useDashboardButtonCustomizationOption = () => {
  const dashboardButtonBackgroundColor =
    DashboardCustomizationStores.useDashboardButtonCustomization(
      (s) => s.dashboardButtonBackgroundColor,
    );
  const dashboardButtonTextColor =
    DashboardCustomizationStores.useDashboardButtonCustomization(
      (s) => s.dashboardButtonTextColor,
    );
  const dashboardButtonDisabledBackgroundColor =
    DashboardCustomizationStores.useDashboardButtonCustomization(
      (s) => s.dashboardButtonDisabledBackgroundColor,
    );
  const dashboardButtonDisabledTextColor =
    DashboardCustomizationStores.useDashboardButtonCustomization(
      (s) => s.dashboardButtonDisabledTextColor,
    );

  const setDashboardButtonColor =
    DashboardCustomizationStores.useDashboardButtonCustomization(
      (s) => s.setColor,
    );

  return {
    dashboardButtonBackgroundColor,
    dashboardButtonTextColor,
    dashboardButtonDisabledBackgroundColor,
    dashboardButtonDisabledTextColor,
    setDashboardButtonColor,
  };
};
export const useTableCustomizationOption = () => {
  const tableHeaderTextColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableHeaderTextColor,
    );
  const tableHoverBackgroundColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableHoverBackgroundColor,
    );
  const tableIconColor = DashboardCustomizationStores.useTableCustomization(
    (s) => s.tableIconColor,
  );
  const tableIconHoverColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableIconHoverColor,
    );
  const tableIconHoverBackgroundColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableIconHoverBackgroundColor,
    );
  const tableRowPrimaryTextColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowPrimaryTextColor,
    );
  const tableRowSecondaryTextColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowSecondaryTextColor,
    );
  const tableRowTertiaryTextColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowTertiaryTextColor,
    );
  const tableRowBadgeOverDueTextColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowBadgeOverDueTextColor,
    );
  const tableRowBadgeOverDueBackgroundColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowBadgeOverDueBackgroundColor,
    );
  const tableRowBadgePendingTextColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowBadgePendingTextColor,
    );
  const tableRowBadgePendingBackgroundColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowBadgePendingBackgroundColor,
    );
  const tableRowBadgePaidTextColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowBadgePaidTextColor,
    );
  const tableBorderColor = DashboardCustomizationStores.useTableCustomization(
    (s) => s.tableBorderColor,
  );
  const tableRowBadgePaidBackgroundColor =
    DashboardCustomizationStores.useTableCustomization(
      (s) => s.tableRowBadgePaidBackgroundColor,
    );

  const setTableColor = DashboardCustomizationStores.useTableCustomization(
    (s) => s.setColor,
  );

  return {
    tableHeaderTextColor,
    tableHoverBackgroundColor,
    tableIconColor,
    tableIconHoverColor,
    tableIconHoverBackgroundColor,
    tableRowPrimaryTextColor,
    tableRowSecondaryTextColor,
    tableRowTertiaryTextColor,
    tableRowBadgeOverDueTextColor,
    tableRowBadgeOverDueBackgroundColor,
    tableRowBadgePendingTextColor,
    tableRowBadgePendingBackgroundColor,
    tableRowBadgePaidTextColor,
    tableRowBadgePaidBackgroundColor,
    tableBorderColor,
    setTableColor,
  };
};
export const useDialogCustomizationOption = () => {
  const dialogBackgroundColor =
    DashboardCustomizationStores.useDialogCustomization(
      (s) => s.dialogBackgroundColor,
    );
  const dialogCloseIconColor =
    DashboardCustomizationStores.useDialogCustomization(
      (s) => s.dialogCloseIconColor,
    );
  const dialogCloseIconBorderColor =
    DashboardCustomizationStores.useDialogCustomization(
      (s) => s.dialogCloseIconBorderColor,
    );

  const setDialogColor = DashboardCustomizationStores.useDialogCustomization(
    (s) => s.setColor,
  );

  return {
    dialogBackgroundColor,
    dialogCloseIconColor,
    dialogCloseIconBorderColor,
    setDialogColor,
  };
};
export const useYearSelectCustomizationOption = () => {
  const yearSelectBackgroundColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectBackgroundColor,
    );
  const yearSelectTextColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectTextColor,
    );
  const yearSelectActiveBorderColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectActiveBorderColor,
    );
  const yearSelectDropDownBackgroundColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectDropDownBackgroundColor,
    );
  const yearSelectDropDownTextColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectDropDownTextColor,
    );
  const yearSelectDropDownActiveTextColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectDropDownActiveTextColor,
    );
  const yearSelectDropDownActiveBackgroundColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectDropDownActiveBackgroundColor,
    );
  const yearSelectDropDownIconColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectDropDownIconColor,
    );
  const yearSelectDropDownHoverBackgroundColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectDropDownHoverBackgroundColor,
    );
  const yearSelectDropDownHoverTextColor =
    DashboardCustomizationStores.useYearSelectCustomization(
      (s) => s.yearSelectDropDownHoverTextColor,
    );

  const setYearSelectColor =
    DashboardCustomizationStores.useYearSelectCustomization((s) => s.setColor);

  return {
    yearSelectBackgroundColor,
    yearSelectTextColor,
    yearSelectActiveBorderColor,
    yearSelectDropDownBackgroundColor,
    yearSelectDropDownTextColor,
    yearSelectDropDownActiveTextColor,
    yearSelectDropDownActiveBackgroundColor,
    yearSelectDropDownIconColor,
    yearSelectDropDownHoverBackgroundColor,
    yearSelectDropDownHoverTextColor,
    setYearSelectColor,
  };
};
export const useToastCustomizationOption = () => {
  const toastBackgroundColor =
    DashboardCustomizationStores.useToastCustomization(
      (s) => s.toastBackgroundColor,
    );
  const toastTitleColor = DashboardCustomizationStores.useToastCustomization(
    (s) => s.toastTitleColor,
  );
  const toastDescriptionColor =
    DashboardCustomizationStores.useToastCustomization(
      (s) => s.toastDescriptionColor,
    );

  const toastErrorBackgroundColor =
    DashboardCustomizationStores.useToastCustomization(
      (s) => s.toastErrorBackgroundColor,
    );
  const toastErrorTitleColor =
    DashboardCustomizationStores.useToastCustomization(
      (s) => s.toastErrorTitleColor,
    );
  const toastErrorDescriptionColor =
    DashboardCustomizationStores.useToastCustomization(
      (s) => s.toastErrorDescriptionColor,
    );

  const setToastColor = DashboardCustomizationStores.useToastCustomization(
    (s) => s.setColor,
  );

  return {
    toastBackgroundColor,
    toastTitleColor,
    toastDescriptionColor,
    toastErrorBackgroundColor,
    toastErrorTitleColor,
    toastErrorDescriptionColor,
    setToastColor,
  };
};
export const useKpiCardCustomizationOption = () => {
  const cardShadowColor = DashboardCustomizationStores.useKpiCardCustomization(
    (s) => s.cardShadowColor,
  );
  const cardBorderColor = DashboardCustomizationStores.useKpiCardCustomization(
    (s) => s.cardBorderColor,
  );
  const cardPrimaryTextColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardPrimaryTextColor,
    );
  const cardSecondaryTextColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardSecondaryTextColor,
    );
  const cardIconPrimaryColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardIconPrimaryColor,
    );
  const cardIconSecondaryColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardIconSecondaryColor,
    );
  const cardIconTertiaryColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardIconTertiaryColor,
    );
  const cardIconPrimaryBackgroundColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardIconPrimaryBackgroundColor,
    );
  const cardIconSecondaryBackgroundColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardIconSecondaryBackgroundColor,
    );
  const cardIconTertiaryBackgroundColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardIconTertiaryBackgroundColor,
    );
  const cardShadowThickness =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardShadowThickness,
    );

  const cardShadow = DashboardCustomizationStores.useKpiCardCustomization(
    (s) => s.cardShadow,
  );
  const cardBorder = DashboardCustomizationStores.useKpiCardCustomization(
    (s) => s.cardBorder,
  );

  const setCardColor = DashboardCustomizationStores.useKpiCardCustomization(
    (s) => s.setColor,
  );
  const setCardSwitch = DashboardCustomizationStores.useKpiCardCustomization(
    (s) => s.setSwitch,
  );
  const cardBackgroundColor =
    DashboardCustomizationStores.useKpiCardCustomization(
      (s) => s.cardBackgroundColor,
    );
  return {
    cardShadowColor,
    cardBorderColor,
    cardPrimaryTextColor,
    cardSecondaryTextColor,
    cardIconPrimaryColor,
    cardIconSecondaryColor,
    cardIconTertiaryColor,
    cardIconPrimaryBackgroundColor,
    cardIconSecondaryBackgroundColor,
    cardIconTertiaryBackgroundColor,
    cardBackgroundColor,
    cardShadowThickness,
    cardShadow,
    cardBorder,
    setCardColor,
    setCardSwitch,
  };
};
export const useChartCustomizationOption = () => {
  const chartHorizontalLineColor =
    DashboardCustomizationStores.useChartCustomization(
      (s) => s.chartHorizontalLineColor,
    );
  const chartDateColor = DashboardCustomizationStores.useChartCustomization(
    (s) => s.chartDateColor,
  );
  const chartPrimaryColor = DashboardCustomizationStores.useChartCustomization(
    (s) => s.chartPrimaryColor,
  );
  const chartSecondaryColor =
    DashboardCustomizationStores.useChartCustomization(
      (s) => s.chartSecondaryColor,
    );
  const chartTertiaryColor = DashboardCustomizationStores.useChartCustomization(
    (s) => s.chartTertiaryColor,
  );
  const chartFourthColor = DashboardCustomizationStores.useChartCustomization(
    (s) => s.chartFourthColor,
  );
  const chartLegendTextColor =
    DashboardCustomizationStores.useChartCustomization(
      (s) => s.chartLegendTextColor,
    );
  const toolTipChartDateColor =
    DashboardCustomizationStores.useChartCustomization(
      (s) => s.toolTipChartDateColor,
    );
  const toolTipBackgroundColor =
    DashboardCustomizationStores.useChartCustomization(
      (s) => s.toolTipBackgroundColor,
    );
  const toolTipTextColor = DashboardCustomizationStores.useChartCustomization(
    (s) => s.toolTipTextColor,
  );
  const toolTipNumberColor = DashboardCustomizationStores.useChartCustomization(
    (s) => s.toolTipNumberColor,
  );
  const setChartThemeColor = DashboardCustomizationStores.useChartCustomization(
    (s) => s.setColor,
  );

  return {
    chartHorizontalLineColor,
    chartDateColor,
    chartPrimaryColor,
    chartSecondaryColor,
    chartTertiaryColor,
    chartFourthColor,
    chartLegendTextColor,
    toolTipChartDateColor,
    toolTipBackgroundColor,
    toolTipTextColor,
    toolTipNumberColor,
    setChartThemeColor,
  };
};
export const usePieChartCustomizationOption = () => {
  const pieColor1 = DashboardCustomizationStores.usePieChartColorCustomization(
    (s) => s.pieColor1,
  );
  const pieColor2 = DashboardCustomizationStores.usePieChartColorCustomization(
    (s) => s.pieColor2,
  );
  const pieColor3 = DashboardCustomizationStores.usePieChartColorCustomization(
    (s) => s.pieColor3,
  );
  const pieColor4 = DashboardCustomizationStores.usePieChartColorCustomization(
    (s) => s.pieColor4,
  );
  const pieColor5 = DashboardCustomizationStores.usePieChartColorCustomization(
    (s) => s.pieColor5,
  );
  const pieColor6 = DashboardCustomizationStores.usePieChartColorCustomization(
    (s) => s.pieColor6,
  );
  const pieColor7 = DashboardCustomizationStores.usePieChartColorCustomization(
    (s) => s.pieColor7,
  );
  const pieColor8 = DashboardCustomizationStores.usePieChartColorCustomization(
    (s) => s.pieColor8,
  );
  const pieFallbackColor =
    DashboardCustomizationStores.usePieChartColorCustomization(
      (s) => s.pieFallbackColor,
    );

  const setPieChartColor =
    DashboardCustomizationStores.usePieChartColorCustomization(
      (s) => s.setColor,
    );

  return {
    pieColor1,
    pieColor2,
    pieColor3,
    pieColor4,
    pieColor5,
    pieColor6,
    pieColor7,
    pieColor8,
    pieFallbackColor,
    setPieChartColor,
  };
};
