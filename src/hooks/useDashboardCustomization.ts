import {
  useChartCustomization,
  useDashboardButtonCustomization,
  useDashboardCardCustomization,
  useDashboardThemeCustomization,
  useDialogCustomization,
  useKpiCardCustomization,
  usePieChartColorCustomization,
  useSidebarCustomization,
  useTableCustomization,
  useToastCustomization,
  useYearSelectCustomization,
} from "@/store/useDashboardCustomizationStore";

export const useSidebarCustomizationOption = () => {
  const sideBarBackgroundColor = useSidebarCustomization(
    (s) => s.sideBarBackgroundColor,
  );
  const sideBarActiveNavigationTextColor = useSidebarCustomization(
    (s) => s.sideBarActiveNavigationTextColor,
  );
  const sideBarInActiveNavigationTextColor = useSidebarCustomization(
    (s) => s.sideBarInActiveNavigationTextColor,
  );
  const sideBarActiveNavigationBackgroundColor = useSidebarCustomization(
    (s) => s.sideBarActiveNavigationBackgroundColor,
  );
  const sideBarHoverNavigationBackgroundColor = useSidebarCustomization(
    (s) => s.sideBarHoverNavigationBackgroundColor,
  );
  const sideBarHoverNavigationTextColor = useSidebarCustomization(
    (s) => s.sideBarHoverNavigationTextColor,
  );
  const sideBarProfileBackgroundColor = useSidebarCustomization(
    (s) => s.sideBarProfileBackgroundColor,
  );
  const sideBarProfileTextPrimaryColor = useSidebarCustomization(
    (s) => s.sideBarProfileTextPrimaryColor,
  );
  const sideBarProfileTextSecondaryColor = useSidebarCustomization(
    (s) => s.sideBarProfileTextSecondaryColor,
  );
  const sideBarNavigationFocusRingColor = useSidebarCustomization(
    (s) => s.sideBarNavigationFocusRingColor,
  );
  const setSidebarColor = useSidebarCustomization((s) => s.setColor);

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
  const dashboardCardShadowThickness = useDashboardCardCustomization(
    (s) => s.dashboardCardShadowThickness,
  );
  const dashboardCardBorderColor = useDashboardCardCustomization(
    (s) => s.dashboardCardBorderColor,
  );
  const dashboardCardBackgroundColor = useDashboardCardCustomization(
    (s) => s.dashboardCardBackgroundColor,
  );
  const dashboardCardShadowColor = useDashboardCardCustomization(
    (s) => s.dashboardCardShadowColor,
  );

  const dashboardCardBorder = useDashboardCardCustomization(
    (s) => s.dashboardCardBorder,
  );
  const dashboardCardShadow = useDashboardCardCustomization(
    (s) => s.dashboardCardShadow,
  );

  const setDashboardCardColor = useDashboardCardCustomization(
    (s) => s.setColor,
  );
  const setDashboardCardSwitch = useDashboardCardCustomization(
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
  const separatorColor = useDashboardThemeCustomization(
    (s) => s.separatorColor,
  );
  const mainBackgroundColor = useDashboardThemeCustomization(
    (s) => s.mainBackgroundColor,
  );
  const dashboardHeaderNameColor = useDashboardThemeCustomization(
    (s) => s.dashboardHeaderNameColor,
  );
  const dashboardHeaderDescColor = useDashboardThemeCustomization(
    (s) => s.dashboardHeaderDescColor,
  );
  const cardHeaderPrimaryTextColor = useDashboardThemeCustomization(
    (s) => s.cardHeaderPrimaryTextColor,
  );
  const cardHeaderSecondaryTextColor = useDashboardThemeCustomization(
    (s) => s.cardHeaderSecondaryTextColor,
  );
  const dialogHeaderColor = useDashboardThemeCustomization(
    (s) => s.dialogHeaderColor,
  );
  const cardHeaderDescriptionTextColor = useDashboardThemeCustomization(
    (s) => s.cardHeaderDescriptionTextColor,
  );
  const setDashboardThemeColor = useDashboardThemeCustomization(
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
  const dashboardButtonBackgroundColor = useDashboardButtonCustomization(
    (s) => s.dashboardButtonBackgroundColor,
  );
  const dashboardButtonTextColor = useDashboardButtonCustomization(
    (s) => s.dashboardButtonTextColor,
  );
  const dashboardButtonDisabledBackgroundColor =
    useDashboardButtonCustomization(
      (s) => s.dashboardButtonDisabledBackgroundColor,
    );
  const dashboardButtonDisabledTextColor = useDashboardButtonCustomization(
    (s) => s.dashboardButtonDisabledTextColor,
  );

  const setDashboardButtonColor = useDashboardButtonCustomization(
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
  const tableHeaderTextColor = useTableCustomization(
    (s) => s.tableHeaderTextColor,
  );
  const tableHoverBackgroundColor = useTableCustomization(
    (s) => s.tableHoverBackgroundColor,
  );
  const tableIconColor = useTableCustomization((s) => s.tableIconColor);
  const tableIconHoverColor = useTableCustomization(
    (s) => s.tableIconHoverColor,
  );
  const tableIconHoverBackgroundColor = useTableCustomization(
    (s) => s.tableIconHoverBackgroundColor,
  );
  const tableRowPrimaryTextColor = useTableCustomization(
    (s) => s.tableRowPrimaryTextColor,
  );
  const tableRowSecondaryTextColor = useTableCustomization(
    (s) => s.tableRowSecondaryTextColor,
  );
  const tableRowTertiaryTextColor = useTableCustomization(
    (s) => s.tableRowTertiaryTextColor,
  );
  const tableRowBadgeOverDueTextColor = useTableCustomization(
    (s) => s.tableRowBadgeOverDueTextColor,
  );
  const tableRowBadgeOverDueBackgroundColor = useTableCustomization(
    (s) => s.tableRowBadgeOverDueBackgroundColor,
  );
  const tableRowBadgePendingTextColor = useTableCustomization(
    (s) => s.tableRowBadgePendingTextColor,
  );
  const tableRowBadgePendingBackgroundColor = useTableCustomization(
    (s) => s.tableRowBadgePendingBackgroundColor,
  );
  const tableRowBadgePaidTextColor = useTableCustomization(
    (s) => s.tableRowBadgePaidTextColor,
  );
  const tableBorderColor = useTableCustomization((s) => s.tableBorderColor);
  const tableRowBadgePaidBackgroundColor = useTableCustomization(
    (s) => s.tableRowBadgePaidBackgroundColor,
  );

  const setTableColor = useTableCustomization((s) => s.setColor);

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
  const dialogBackgroundColor = useDialogCustomization(
    (s) => s.dialogBackgroundColor,
  );
  const dialogCloseIconColor = useDialogCustomization(
    (s) => s.dialogCloseIconColor,
  );
  const dialogCloseIconBorderColor = useDialogCustomization(
    (s) => s.dialogCloseIconBorderColor,
  );

  const setDialogColor = useDialogCustomization((s) => s.setColor);

  return {
    dialogBackgroundColor,
    dialogCloseIconColor,
    dialogCloseIconBorderColor,
    setDialogColor,
  };
};
export const useYearSelectCustomizationOption = () => {
  const yearSelectBackgroundColor = useYearSelectCustomization(
    (s) => s.yearSelectBackgroundColor,
  );
  const yearSelectTextColor = useYearSelectCustomization(
    (s) => s.yearSelectTextColor,
  );
  const yearSelectActiveBorderColor = useYearSelectCustomization(
    (s) => s.yearSelectActiveBorderColor,
  );
  const yearSelectDropDownBackgroundColor = useYearSelectCustomization(
    (s) => s.yearSelectDropDownBackgroundColor,
  );
  const yearSelectDropDownTextColor = useYearSelectCustomization(
    (s) => s.yearSelectDropDownTextColor,
  );
  const yearSelectDropDownActiveTextColor = useYearSelectCustomization(
    (s) => s.yearSelectDropDownActiveTextColor,
  );
  const yearSelectDropDownActiveBackgroundColor = useYearSelectCustomization(
    (s) => s.yearSelectDropDownActiveBackgroundColor,
  );
  const yearSelectDropDownIconColor = useYearSelectCustomization(
    (s) => s.yearSelectDropDownIconColor,
  );
  const yearSelectDropDownHoverBackgroundColor = useYearSelectCustomization(
    (s) => s.yearSelectDropDownHoverBackgroundColor,
  );
  const yearSelectDropDownHoverTextColor = useYearSelectCustomization(
    (s) => s.yearSelectDropDownHoverTextColor,
  );

  const setYearSelectColor = useYearSelectCustomization((s) => s.setColor);

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
  const toastBackgroundColor = useToastCustomization(
    (s) => s.toastBackgroundColor,
  );
  const toastTitleColor = useToastCustomization((s) => s.toastTitleColor);
  const toastDescriptionColor = useToastCustomization(
    (s) => s.toastDescriptionColor,
  );

  const toastErrorBackgroundColor = useToastCustomization(
    (s) => s.toastErrorBackgroundColor,
  );
  const toastErrorTitleColor = useToastCustomization(
    (s) => s.toastErrorTitleColor,
  );
  const toastErrorDescriptionColor = useToastCustomization(
    (s) => s.toastErrorDescriptionColor,
  );

  const setToastColor = useToastCustomization((s) => s.setColor);

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
  const cardShadowColor = useKpiCardCustomization((s) => s.cardShadowColor);
  const cardBorderColor = useKpiCardCustomization((s) => s.cardBorderColor);
  const cardPrimaryTextColor = useKpiCardCustomization(
    (s) => s.cardPrimaryTextColor,
  );
  const cardSecondaryTextColor = useKpiCardCustomization(
    (s) => s.cardSecondaryTextColor,
  );
  const cardIconPrimaryColor = useKpiCardCustomization(
    (s) => s.cardIconPrimaryColor,
  );
  const cardIconSecondaryColor = useKpiCardCustomization(
    (s) => s.cardIconSecondaryColor,
  );
  const cardIconTertiaryColor = useKpiCardCustomization(
    (s) => s.cardIconTertiaryColor,
  );
  const cardIconPrimaryBackgroundColor = useKpiCardCustomization(
    (s) => s.cardIconPrimaryBackgroundColor,
  );
  const cardIconSecondaryBackgroundColor = useKpiCardCustomization(
    (s) => s.cardIconSecondaryBackgroundColor,
  );
  const cardIconTertiaryBackgroundColor = useKpiCardCustomization(
    (s) => s.cardIconTertiaryBackgroundColor,
  );
  const cardShadowThickness = useKpiCardCustomization(
    (s) => s.cardShadowThickness,
  );

  const cardShadow = useKpiCardCustomization((s) => s.cardShadow);
  const cardBorder = useKpiCardCustomization((s) => s.cardBorder);

  const setCardColor = useKpiCardCustomization((s) => s.setColor);
  const setCardSwitch = useKpiCardCustomization((s) => s.setSwitch);
  const cardBackgroundColor = useKpiCardCustomization(
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
  const chartHorizontalLineColor = useChartCustomization(
    (s) => s.chartHorizontalLineColor,
  );
  const chartDateColor = useChartCustomization((s) => s.chartDateColor);
  const chartPrimaryColor = useChartCustomization((s) => s.chartPrimaryColor);
  const chartSecondaryColor = useChartCustomization(
    (s) => s.chartSecondaryColor,
  );
  const chartTertiaryColor = useChartCustomization((s) => s.chartTertiaryColor);
  const chartFourthColor = useChartCustomization((s) => s.chartFourthColor);
  const chartLegendTextColor = useChartCustomization(
    (s) => s.chartLegendTextColor,
  );
  const toolTipChartDateColor = useChartCustomization(
    (s) => s.toolTipChartDateColor,
  );
  const toolTipBackgroundColor = useChartCustomization(
    (s) => s.toolTipBackgroundColor,
  );
  const toolTipTextColor = useChartCustomization((s) => s.toolTipTextColor);
  const toolTipNumberColor = useChartCustomization((s) => s.toolTipNumberColor);
  const setChartThemeColor = useChartCustomization((s) => s.setColor);

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
  const pieColor1 = usePieChartColorCustomization((s) => s.pieColor1);
  const pieColor2 = usePieChartColorCustomization((s) => s.pieColor2);
  const pieColor3 = usePieChartColorCustomization((s) => s.pieColor3);
  const pieColor4 = usePieChartColorCustomization((s) => s.pieColor4);
  const pieColor5 = usePieChartColorCustomization((s) => s.pieColor5);
  const pieColor6 = usePieChartColorCustomization((s) => s.pieColor6);
  const pieColor7 = usePieChartColorCustomization((s) => s.pieColor7);
  const pieColor8 = usePieChartColorCustomization((s) => s.pieColor8);
  const pieFallbackColor = usePieChartColorCustomization(
    (s) => s.pieFallbackColor,
  );

  const setPieChartColor = usePieChartColorCustomization((s) => s.setColor);

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
