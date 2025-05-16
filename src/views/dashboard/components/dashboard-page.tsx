"use client";

import { lazy, Suspense, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DifferentData, RevenueType } from "@/views/dashboard/api/data";
import { CardWrapper } from "./card-wrapper";
import { cn } from "@/lib/utils";

// 懒加载组件
const Revenue = lazy(() => import("@/views/dashboard/components/revenue"));
const TopList = lazy(() => import("@/views/dashboard/components/top-list"));

interface DashboardPageProps {
  annualyPrice: DifferentData;
  monthlyPrice: DifferentData;
  annualyRepairs: DifferentData;
  monthlyRepairs: DifferentData;
  componentsPrice: number;
  stock: number;
  sellProductStock: number;
  sellProductTotalPrice: number;
  topList: { name: string; count: number }[];
  dataRevenue: RevenueType[];
}

// Skeleton specific for the Revenue Chart area
function RevenueSkeleton() {
  return <Skeleton className="h-[350px] w-full rounded-lg bg-muted/80" />;
}

// Skeleton specific for the TopList area
function TopListSkeleton() {
  return <Skeleton className="h-[400px] w-full rounded-lg bg-muted/80" />;
}

export function DashboardPage({
  annualyPrice,
  monthlyPrice,
  annualyRepairs,
  monthlyRepairs,
  componentsPrice,
  stock,
  topList,
  dataRevenue,
  sellProductStock,
  sellProductTotalPrice,
}: DashboardPageProps) {
  // 使用useMemo缓存卡片数据
  const cardData = useMemo(
    () => [
      {
        title: "年度收入",
        value: annualyPrice.current,
        lastValue: annualyPrice.last,
        type: "revenue",
      },
      {
        title: "月度收入",
        value: monthlyPrice.current,
        lastValue: monthlyPrice.last,
        type: "revenue",
      },
      {
        title: "年度维修量",
        value: annualyRepairs.current,
        lastValue: annualyRepairs.last,
        type: "count",
      },
      {
        title: "月度维修量",
        value: monthlyRepairs.current,
        lastValue: monthlyRepairs.last,
        type: "count",
      },
      { title: "配件总价值", value: componentsPrice, type: "revenue" },
      { title: "库存总量", value: stock, type: "count" },
      {
        title: "前台配件总价值",
        value: sellProductTotalPrice,
        type: "revenue",
      },
      { title: "前台配件库存总量", value: sellProductStock, type: "count" },
    ],
    [
      annualyPrice,
      monthlyPrice,
      annualyRepairs,
      monthlyRepairs,
      componentsPrice,
      stock,
    ]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card, index) => (
          <CardWrapper
            key={card.title + index}
            title={card.title}
            value={card.value}
            lastValue={card.lastValue}
            type={card.type as "revenue" | "count"}
            className="transition-all hover:-translate-y-1 hover:shadow-lg"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <Suspense fallback={<RevenueSkeleton />}>
          <Revenue
            data={dataRevenue}
            className="lg:col-span-4 animate-in fade-in-50 duration-500"
          />
        </Suspense>

        <Suspense fallback={<TopListSkeleton />}>
          <TopList
            data={topList}
            className="lg:col-span-3 animate-in fade-in-75 duration-500"
          />
        </Suspense>
      </div>
    </div>
  );
}

//   const data = await fetchRevenue();
//   return (
//     <div className="p-8">
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center">
//           <h2 className="text-3xl font-bold tracking-tight">首页</h2>
//         </div>

//         <div className="space-y-4">
//           <CardWrapper />
//           <div className="grid gap-4 grid-cols-1 md:grid-cols-2 auto-cols-min">
//             <Revenue data={data} />
//             <TopList />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
