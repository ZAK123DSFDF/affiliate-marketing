import React from "react";
import CustomizationPage from "@/components/pages/Dashboard/Customization/CustomizationPage";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";
import {
  getAuthCustomization,
  getDashboardCustomization,
} from "@/app/seller/[orgId]/dashboard/customization/action";
export default async function CustomizationServerPage({ params }: OrgIdProps) {
  const { orgId } = await params;
  const org = await validateOrg(orgId);

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  return (
    <>
      <CustomizationPage orgId={orgId} />
    </>
  );
}
