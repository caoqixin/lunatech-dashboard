import DashboardPage from "@/components/pages/dashboard/dashboard-page";
import { Metadata } from "next";

export default function Page() {
  return <DashboardPage />;
}

export const metadata: Metadata = {
  title: "首页",
};
