// app/dashboard/page.tsx
import AffiliateOverview from "@/components/pages/AffiliateDashboard/AffiliateOverview/AffiliateOverview";

const DashboardPage = async () => {
  return (
    <>
      <AffiliateOverview affiliate />
    </>
  );
};

export default DashboardPage;
