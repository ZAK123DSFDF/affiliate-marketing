export function toValidShadowSize(
  size: string | undefined,
): "sm" | "md" | "lg" | "xl" {
  if (size === "sm" || size === "md" || size === "lg" || size === "xl") {
    return size;
  }
  return "lg";
}
