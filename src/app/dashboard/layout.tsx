import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Suspense } from "react";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";

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
    <div className="min-h-screen bg-background">
      <div className="flex w-full">
        {/* 侧边栏 - 使用固定宽度和定位 */}
        <aside className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-screen border-r">
          <Suspense
            fallback={
              <div className="p-4">
                <SkeletonWrapper variant="card" />
              </div>
            }
          >
            <Sidebar />
          </Suspense>
        </aside>

        {/* 主内容区域 */}
        <div className="w-full transition-all duration-300 lg:pl-[264px]">
          <div className="mx-auto max-w-screen-2xl h-screen flex flex-col">
            <Navbar showBackButton={false} />
            <main className="flex-1 overflow-auto py-4 px-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
