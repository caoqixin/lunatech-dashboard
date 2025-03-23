import { Metadata } from "next";
import { redirect } from "next/navigation";

import { isLoggedIn } from "@/server/user";
import { fetchDashboardData } from "@/views/dashboard/api/data";
import { DashboardPage } from "@/views/dashboard/components/dashboard-page";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  // 并行获取所有数据
  const {
    annualyPrice,
    monthlyPrice,
    annualyRepairs,
    monthlyRepairs,
    componentsStock,
    componentsPrice,
    revenue,
    topRepair,
  } = await fetchDashboardData();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage
        annualyPrice={annualyPrice}
        monthlyPrice={monthlyPrice}
        annualyRepairs={annualyRepairs}
        monthlyRepairs={monthlyRepairs}
        componentsPrice={componentsPrice}
        stock={componentsStock}
        topList={topRepair}
        dataRevenue={revenue}
      />
    </Suspense>
  );
}

// 仪表盘骨架屏
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-80 col-span-4 rounded-lg" />
        <Skeleton className="h-80 lg:col-span-3 rounded-lg" />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "首页",
};
