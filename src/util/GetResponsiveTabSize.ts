export const getResponsiveTabSize = (scale: number = 1) => {
  const base100 = Math.round(100 * scale)
  const base120 = Math.round(120 * scale)
  const base140 = Math.round(140 * scale)

  return `
    min-w-[${base100}px] px-${Math.round(3 * scale)} py-${Math.round(
      2 * scale
    )} text-sm
    xs:min-w-[${base120}px] xs:px-${Math.round(
      4 * scale
    )} xs:py-${Math.round(2.5 * scale)} xs:text-sm
    sm:min-w-[${base140}px] sm:px-${Math.round(
      6 * scale
    )} sm:py-${Math.round(3 * scale)} sm:text-base
  `
}
