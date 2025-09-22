import Papa from "papaparse"

function normalizeKey(key: string) {
  return key
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/\s+/g, "_")
    .replace(/\W/g, "")
}

function parseCurrency(value: string) {
  if (!value) return { amount: null, currency: null }

  const match = value.match(/([\d,.]+)\s*([A-Za-z]{3})?$/)
  if (!match) return { amount: null, currency: null }

  const amount = parseFloat(match[1].replace(/,/g, ""))
  const currency = match[2] ?? null

  return { amount, currency }
}

const REQUIRED_FIELDS = [
  "Transaction_ID",
  "Recipient",
  "Unique_Identifier",
  "Amount",
  "Fee",
  "Total",
  "Status",
  "Custom_Note",
]

export function parsePaypalCSV(csvText: string) {
  const lines = csvText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const meta: Record<string, string> = {}
  let tableStartIndex = -1

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("Transaction ID")) {
      tableStartIndex = i
      break
    }
    const [rawKey, ...rest] = lines[i].split(":")
    if (rest.length > 0) {
      const key = normalizeKey(rawKey)
      meta[key] = rest.join(":").trim().replace(/^"|"$/g, "")
    }
  }

  const tableCSV = lines.slice(tableStartIndex).join("\n")

  const parsed = Papa.parse(tableCSV, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeKey,
  })

  const headers = parsed.meta.fields?.map((h) => h.trim()) ?? []

  // ✅ Validation: ensure required PayPal fields exist
  if (!headers.length || !REQUIRED_FIELDS.every((f) => headers.includes(f))) {
    throw new Error("Invalid PayPal CSV: Required transaction columns missing")
  }

  const transactions = (parsed.data as Record<string, any>[]).map((row) => {
    const fixed: Record<string, any> = {}

    for (const h of headers) {
      const raw = row[h] != null ? String(row[h]).trim() : ""
      if (
        [
          "Amount",
          "Fee",
          "Total",
          "Payment_Amount",
          "Completed_Amount",
        ].includes(h)
      ) {
        fixed[h] = parseCurrency(raw)
      } else {
        fixed[h] = raw
      }
    }

    if (row.__parsed_extra && Array.isArray(row.__parsed_extra)) {
      row.__parsed_extra.forEach((val: any, i: number) => {
        fixed[`extra_${i + 1}`] = val != null ? String(val).trim() : ""
      })
    }

    return fixed
  })

  return {
    meta,
    transactions,
  }
}
