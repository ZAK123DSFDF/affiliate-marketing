export const getShadowWithColor = (
  size: "sm" | "md" | "lg" | "xl",
  color?: string,
) => {
  const shadowColor = color || "rgba(0, 0, 0, 0.1)";
  const shadows = {
    sm: `0 1px 2px 0 ${shadowColor}`,
    md: `0 4px 6px -1px ${shadowColor}, 0 2px 4px -2px ${shadowColor}`,
    lg: `0 10px 15px -3px ${shadowColor}, 0 4px 6px -4px ${shadowColor}`,
    xl: `0 20px 25px -5px ${shadowColor}, 0 8px 10px -6px ${shadowColor}`,
  };

  return shadows[size];
};
