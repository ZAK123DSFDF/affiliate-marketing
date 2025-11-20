export const getResponsiveSelectWidth = (isPreview: boolean) => {
  return isPreview
    ? "w-[58px]  md:w-[72px] h-8 px-2 text-xs"
    : "w-[60px] xs:w-[100px] md:w-[100px] h-9 px-2 text-sm"
}
