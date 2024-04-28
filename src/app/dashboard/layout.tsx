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
    <div className="h-screen w-screen overflow-x-hidden">
      <Header />
      <div className="w-screen">
        <div className="grid grid-cols-12">
          <Sidebar />
          <main className="col-span-10 max-lg:col-span-12 pt-16 border-l">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
