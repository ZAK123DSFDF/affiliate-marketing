// app/dashboard/page.tsx
import Dashboard from "@/components/pages/Dashboard";

const DashboardPage = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/check");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // Handle the data as needed
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
