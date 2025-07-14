import React from "react";
import DataTableDemo from "@/components/pages/Dashboard/Affiliates/Affiliates";
import Payouts from "@/components/pages/Dashboard/Payouts/Payouts";
import PayoutPage from "@/components/pages/Dashboard/Payouts/PayoutTop";
import { OrgIdProps } from "@/lib/types/orgId";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { getAffiliatePayouts } from "@/app/seller/[orgId]/dashboard/payout/action";
import PayoutTable from "@/components/pages/Dashboard/Payouts/PayoutTable";

const payoutPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  const res = await getAffiliatePayouts(orgId);
  if (!res.ok) {
    redirect(`/error?message=${encodeURIComponent(res.error)}`);
  }
  return (
    <>
      <PayoutTable data={res.data} orgId={orgId} />
    </>
  );
};
export default payoutPage;
