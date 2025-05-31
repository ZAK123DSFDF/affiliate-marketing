// app/dashboard/page.tsx
import Dashboard from "@/components/pages/Dashboard/Dashboard";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("login");
  }
  console.log("Session:", session);
  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
