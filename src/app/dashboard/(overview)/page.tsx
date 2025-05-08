import { Metadata } from "next";
import { redirect } from "next/navigation";

import { isLoggedIn } from "@/server/user";
import { fetchDashboardData } from "@/views/dashboard/api/data";
import { DashboardPage } from "@/views/dashboard/components/dashboard-page";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// 指定为动态渲染
export const dynamic = "force-dynamic";

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
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="h-[116px] w-full rounded-lg bg-muted/80"
            />
          ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[350px] rounded-lg bg-muted/80 lg:col-span-4" />
        <Skeleton className="h-[400px] rounded-lg bg-muted/80 lg:col-span-3" />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "仪表盘 | Luna Tech",
};
