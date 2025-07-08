"use server";

import { db } from "@/db/drizzle";
import { affiliateLink } from "@/db/schema";
import { generateAffiliateCode } from "@/util/idGenerators";
import { getOrganization } from "@/util/GetOrganization";
import { revalidatePath } from "next/cache";
type AffiliateLinkWithStats = {
  id: string;
  fullUrl: string;
  clicks: number;
  sales: number;
  createdAt: Date;
};

export const createAffiliateLink = async () => {
  const { org, decoded } = await getOrganization();

  const code = generateAffiliateCode(); // e.g., "7hjKpQ"
  const param = org.referralParam;
  const domain = org.domainName.replace(/^https?:\/\//, "");

  const fullUrl = `https://${domain}/?${param}=${code}`;

  await db.insert(affiliateLink).values({
    id: code,
    affiliateId: decoded.id,
    organizationId: decoded.organizationId,
  });
  revalidatePath(`/affiliate/${org.id}/dashboard/links`);
  return fullUrl;
};

export const getAffiliateLinksWithStats = async (): Promise<
  AffiliateLinkWithStats[]
> => {
  const { org, decoded } = await getOrganization();

  const baseDomain = org.domainName.replace(/^https?:\/\//, "");
  const param = org.referralParam;

  // Step 2: Get only this affiliate's links
  const links = await db.query.affiliateLink.findMany({
    where: (l, { and, eq }) =>
      and(
        eq(l.affiliateId, decoded.id),
        eq(l.organizationId, decoded.organizationId),
      ),
  });

  const linkIds = links.map((link) => link.id);

  if (linkIds.length === 0) return [];

  // Step 3: Fetch related clicks & sales using `inArray`
  const [clicks, payments] = await Promise.all([
    db.query.affiliateClick.findMany({
      where: (c, { inArray }) => inArray(c.affiliateLinkId, linkIds),
    }),
    db.query.affiliatePayment.findMany({
      where: (p, { inArray }) => inArray(p.affiliateLinkId, linkIds),
    }),
  ]);

  // Step 4: Build stats per link
  return links.map((link) => {
    const linkClicks = clicks.filter((c) => c.affiliateLinkId === link.id);
    const linkSales = payments.filter((p) => p.affiliateLinkId === link.id);

    return {
      id: link.id,
      fullUrl: `https://${baseDomain}/?${param}=${link.id}`,
      clicks: linkClicks.length,
      sales: linkSales.length,
      createdAt: link.createdAt,
    };
  });
};
