export const formatValue = (
  label: string,
  value: number,
  currency?: string
) => {
  const monetaryLabels = [
    "Total Commission",
    "Unpaid Commission",
    "Paid Commission",
    "Total Amount",
  ]

  if (monetaryLabels.includes(label) && currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value)
  }

  return value.toLocaleString()
}
