import React from "react";
import { OrgIdProps } from "@/lib/types/orgId";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { getAffiliateCommissionByMonth } from "@/app/affiliate/[orgId]/dashboard/payment/action";
import PaymentTable from "@/components/pages/AffiliateDashboard/Payment/Payment";

const paymentPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  const res = await getAffiliateCommissionByMonth();
  if (!res.ok) {
    redirect(`/error?message=${encodeURIComponent(res.error)}`);
  }
  return (
    <>
      <PaymentTable orgId={orgId} affiliate data={res.data} />
    </>
  );
};
export default paymentPage;
