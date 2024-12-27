import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

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
    <div className="min-h-screen">
      <div className="flex w-full">
        <div className="fixed lef-0 top-0 hidden lg:block lg:w-[264px] h-screen overflow-y-auto ">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full h-screen">
          <div className="mx-auto max-w-screen-2xl h-screen">
            <Navbar />
            <Separator className="my-2" />
            <main className="h-full py-2 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
