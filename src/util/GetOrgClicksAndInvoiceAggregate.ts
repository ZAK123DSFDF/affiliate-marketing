import { ClickAggRow, InvoiceAggRow } from "@/lib/types/aggregateTypes";
import { AffiliatePayout } from "@/lib/types/affiliateStats";

export function getOrgClicksAndInvoiceAggregate(
  clickAgg: ClickAggRow[],
  invoiceAgg: InvoiceAggRow[],
  affRows: { id: string; email: string }[],
  linksByAffiliate: Record<string, string[]>,
) {
  const clicksMap = new Map(clickAgg.map((r) => [r.linkId, r.visits]));
  const invoiceMap = new Map(
    invoiceAgg.map((r) => [
      r.linkId,
      {
        sales: r.subs + r.singles,
        commission: r.commission,
        paid: r.paid,
        unpaid: r.unpaid,
      },
    ]),
  );

  const rows: AffiliatePayout[] = affRows.map((aff) => {
    const urls = linksByAffiliate[aff.id] ?? [];

    let visitors = 0;
    let sales = 0;
    let commission = 0;
    let paid = 0;
    let unpaid = 0;

    for (const url of urls) {
      const linkId = url.split("=").pop()!;

      visitors += clicksMap.get(linkId) ?? 0;

      const inv = invoiceMap.get(linkId);
      if (inv) {
        sales += inv.sales;
        commission += inv.commission;
        paid += inv.paid;
        unpaid += inv.unpaid;
      }
    }

    return {
      id: aff.id,
      email: aff.email,
      visitors,
      sales,
      commission,
      paid,
      unpaid,
      links: urls,
    };
  });
  return rows;
}
