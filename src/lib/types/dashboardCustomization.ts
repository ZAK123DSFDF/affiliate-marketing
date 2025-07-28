export interface dashboardCustomizationSettings {
  sideBarBackgroundColor: string;
  sideBarActiveNavigationTextColor: string;
  sideBarInActiveNavigationTextColor: string;
  sideBarActiveNavigationBackgroundColor: string;
  sideBarHoverNavigationBackgroundColor: string;
  sideBarHoverNavigationTextColor: string;
  sideBarProfileBackgroundColor: string;
  sideBarProfileTextPrimaryColor: string;
  sideBarProfileTextSecondaryColor: string;
  mainBackgroundColor: string;
  cardShadow: "none" | "sm" | "md" | "lg" | "xl";
  cardBorder: boolean;
  cardBorderColor: string;
  cardBackgroundColor: string;
  cardShadowColor: string;
  headerNameColor: string;
  headerDescColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  buttonDisabledBackgroundColor: string;
  buttonDisabledTextColor: string;
}
export type localDashboardCustomizationSettings = Omit<
  dashboardCustomizationSettings,
  "mainBackgroundColor"
>;
export type ColorCustomizationSettings = Omit<
  localDashboardCustomizationSettings,
  "cardBorder" | "cardShadow"
>;
