import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Luna Tech - Dashboard",
    default: "Luna Tech - Dashboard",
  },
  description: "个人手机维修店管理后台",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="w-full pt-16 border-l">{children}</main>
      </div>
    </>
  );
}
