export type AffiliateClickStat = {
  createdAt: Date;
  count: number;
};

export type AffiliateSaleStat = {
  createdAt: Date;
  count: number;
};

export type DummyAffiliateLink = {
  id: string;
  fullUrl: string;
  createdAt: Date;
  clicks: AffiliateClickStat[];
  sales: AffiliateSaleStat[];
};
