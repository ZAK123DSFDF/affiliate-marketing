export type ClickAggRow = {
  linkId: string;
  visits: number;
};

export type InvoiceAggRow = {
  linkId: string;
  subs: number;
  singles: number;
  commission: number;
  paid: number;
  unpaid: number;
};
