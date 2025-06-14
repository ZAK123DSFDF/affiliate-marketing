import { customAlphabet } from "nanoid";
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const generateAffiliateCode = customAlphabet(alphabet, 6);
const code = generateAffiliateCode();
