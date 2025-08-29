import { ExchangeRate } from "@/util/ExchangeRate"

export const convertedCurrency = async <
  T extends {
    commission?: number
    paid?: number
    unpaid?: number
  },
>(
  currency: string,
  rows: T[]
): Promise<
  (T & { currency: string; commission: number; paid: number; unpaid: number })[]
> => {
  const rate = await ExchangeRate(currency)

  return rows.map((row) => ({
    ...row,
    commission: (row.commission ?? 0) * rate,
    paid: (row.paid ?? 0) * rate,
    unpaid: (row.unpaid ?? 0) * rate,
    currency,
  }))
}
