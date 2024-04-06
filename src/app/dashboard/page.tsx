import DashboardPage from "@/components/pages/dashboard/dashboard-page";
import { auth } from "@/lib/user";
import { Metadata } from "next";

export default async function Page() {
  await auth();
  return <DashboardPage />;
}

export const metadata: Metadata = {
  title: "首页",
};
