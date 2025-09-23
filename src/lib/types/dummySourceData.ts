import {
  AffiliateReferrerStat,
  SellerReferrerStat,
} from "@/lib/types/affiliateReferrerStat"

export const dummySourceData: (AffiliateReferrerStat | SellerReferrerStat)[] = [
  { referrer: "unknown", clicks: 2 },
  { referrer: "google.com", clicks: 5 },
  { referrer: "facebook.com", clicks: 3 },
  { referrer: "twitter.com", clicks: 4 },
  { referrer: "linkedin.com", clicks: 1 },
  { referrer: "instagram.com", clicks: 6 },
  { referrer: "youtube.com", clicks: 7 },
  { referrer: "tiktok.com", clicks: 2 },
  { referrer: "pinterest.com", clicks: 3 },
]
