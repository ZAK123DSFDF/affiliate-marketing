import dns from "dns/promises"
const EXPECTED_CNAME = "cname.refearnapp.com"
export async function verifyOrgCNAME(domain: string) {
  if (process.env.NODE_ENV === "production") {
    const records = await dns.resolveCname(domain)
    const isValid = records.some((record) => record === EXPECTED_CNAME)

    if (!isValid) {
      throw {
        status: 400,
        error: "Invalid CNAME record",
        toast: `❌ Expected ${EXPECTED_CNAME}, but got ${records.join(", ")}`,
      }
    }
  } else {
    console.log(`Simulating CNAME verification for ${domain}`)
    await new Promise((r) => setTimeout(r, 1000))
  }
}
