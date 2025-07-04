import { customAlphabet } from "nanoid";
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const generateAffiliateCode = customAlphabet(alphabet, 6);
export const generateOrganizationId = customAlphabet(alphabet, 8);
export const generateAffiliateClickId = customAlphabet(alphabet, 8);
export const generateInviteLinkId = customAlphabet(alphabet, 8);
export const generateAffiliatePaymentLinkId = () => {
  const nanoid = customAlphabet(alphabet, 8);
  return `pay_${nanoid()}`;
};
