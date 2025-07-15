export interface AffiliatePayout {
  id: string;
  email: string;
  visitors: number;
  sales: number;
  commission: number;
  paid: number;
  unpaid: number;
  links: string[];
}
