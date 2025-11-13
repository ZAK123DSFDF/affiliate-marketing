import { customAlphabet } from "nanoid"
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
export const generateAffiliateCode = customAlphabet(alphabet, 6)
export const generateOrganizationId = customAlphabet(alphabet, 8)
export const generateAffiliateClickId = customAlphabet(alphabet, 8)
export const generateInviteLinkId = customAlphabet(alphabet, 8)
export const generateDomainId = customAlphabet(alphabet, 7)
export const generateAffiliatePaymentLinkId = () => {
  const nanoid = customAlphabet(alphabet, 9)
  return `pay_${nanoid()}`
}
export const generateExpirationDateId = customAlphabet(alphabet, 8)
export function generatePaddleId(prefix: "sub" | "pur") {
  const random = Math.random().toString(36).substring(2, 10)
  return `${prefix}_${random}`
}
