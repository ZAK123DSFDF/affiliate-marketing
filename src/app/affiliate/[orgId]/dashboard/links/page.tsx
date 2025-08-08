import React from "react";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import { getAffiliateLinksWithStats } from "@/app/affiliate/[orgId]/dashboard/links/action";
import { redirect } from "next/navigation";

const linksPage = async () => {
  const links = await getAffiliateLinksWithStats();
  if (!links.ok) {
    // Handle the error case - you might want to redirect or show an error
    redirect(`/error?message=${encodeURIComponent(links.error)}`);
  }
  return (
    <>
      <Links affiliate data={links.data} />
    </>
  );
};
export default linksPage;
