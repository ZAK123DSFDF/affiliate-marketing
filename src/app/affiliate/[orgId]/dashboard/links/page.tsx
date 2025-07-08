import React from "react";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import { getAffiliateLinksWithStats } from "@/app/affiliate/[orgId]/dashboard/links/action";

const linksPage = async () => {
  const links = await getAffiliateLinksWithStats();
  return (
    <>
      <Links links={links} />
    </>
  );
};
export default linksPage;
