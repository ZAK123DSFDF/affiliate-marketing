export function safeFormatAmount(input: any): string {
  return Number(input || 0).toFixed(2)
}
