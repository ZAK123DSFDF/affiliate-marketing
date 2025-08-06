import {
  useDashboardButtonCustomization,
  useDashboardCardCustomization,
  useDashboardThemeCustomization,
  useDialogCustomization,
  useSidebarCustomization,
  useTableCustomization,
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

  const setDashboardThemeColor = useDashboardThemeCustomization(
    (s) => s.setColor,
  );

  return {
    mainBackgroundColor,
    dashboardHeaderNameColor,
    dashboardHeaderDescColor,
    setDashboardThemeColor,
    separatorColor,
    cardHeaderPrimaryTextColor,
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
