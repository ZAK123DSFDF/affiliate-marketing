import dns from "dns/promises"

const EXPECTED_IP = "123.45.67.89"
export async function verifyOrgARECORD(domain: string) {
  if (process.env.NODE_ENV === "production") {
    const records = await dns.resolve4(domain)
    const isValid = records.includes(EXPECTED_IP)

    if (!isValid) {
      throw {
        status: 400,
        error: "Invalid A record",
        toast: `❌ Expected IP ${EXPECTED_IP}, but got ${records.join(", ")}`,
      }
    }
  } else {
    console.log(`Simulating A record verification for ${domain}`)
    await new Promise((r) => setTimeout(r, 1000))
  }
}
