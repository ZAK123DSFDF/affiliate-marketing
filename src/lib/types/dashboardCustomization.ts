export interface dashboardCustomizationSettings {
  sideBarBackgroundColor: string
  sideBarActiveNavigationTextColor: string
  sideBarInActiveNavigationTextColor: string
  sideBarActiveNavigationBackgroundColor: string
  sideBarHoverNavigationBackgroundColor: string
  sideBarHoverNavigationTextColor: string
  sideBarProfileBackgroundColor: string
  sideBarProfileTextPrimaryColor: string
  sideBarProfileTextSecondaryColor: string
  mainBackgroundColor: string
  cardShadow: "none" | "sm" | "md" | "lg" | "xl"
  cardBorder: boolean
  cardBorderColor: string
  cardBackgroundColor: string
  cardShadowColor: string
  headerNameColor: string
  headerDescColor: string
  buttonBackgroundColor: string
  buttonTextColor: string
  buttonDisabledBackgroundColor: string
  buttonDisabledTextColor: string
  tableBorderColor: string
  tableHeaderTextColor: string
  tableHoverBackgroundColor: string
  tableIconColor: string
  tableIconHoverColor: string
  tableIconHoverBackgroundColor: string
  tableRowPrimaryTextColor: string
  tableRowSecondaryTextColor: string
  tableRowTertiaryTextColor: string
  tableRowBadgeOverDueTextColor: string
  tableRowBadgeOverDueBackgroundColor: string
  tableRowBadgePendingTextColor: string
  tableRowBadgePendingBackgroundColor: string
  tableRowBadgePaidTextColor: string
  tableRowBadgePaidBackgroundColor: string
  separatorColor: string
  dialogBackgroundColor: string
  dialogCloseIconColor: string
  dialogCloseIconBorderColor: string
  yearSelectBackgroundColor: string
  yearSelectTextColor: string
  yearSelectActiveBorderColor: string
  yearSelectDropDownBackgroundColor: string
  yearSelectDropDownTextColor: string
  yearSelectDropDownActiveTextColor: string
  yearSelectDropDownActiveBackgroundColor: string
  yearSelectDropDownIconColor: string
  yearSelectDropDownHoverBackgroundColor: string
  yearSelectDropDownHoverTextColor: string
}
export type localDashboardCustomizationSettings = Omit<
  dashboardCustomizationSettings,
  "mainBackgroundColor"
>
export type ColorCustomizationSettings = Omit<
  localDashboardCustomizationSettings,
  "cardBorder" | "cardShadow"
>
