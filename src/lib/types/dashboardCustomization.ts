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
}
export type localDashboardCustomizationSettings = Omit<
  dashboardCustomizationSettings,
  "mainBackgroundColor"
>;
