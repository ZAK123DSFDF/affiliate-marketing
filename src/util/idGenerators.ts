import { customAlphabet } from "nanoid";
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const generateAffiliateCode = customAlphabet(alphabet, 6);
export const generateOrganizationId = customAlphabet(alphabet, 8);
