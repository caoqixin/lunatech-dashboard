import { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardPage from "@/views/dashboard/components/dashboard-page";
import { isLoggedIn } from "@/server/user";

export default async function Page() {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  return <DashboardPage />;
}

export const metadata: Metadata = {
  title: "首页",
};
