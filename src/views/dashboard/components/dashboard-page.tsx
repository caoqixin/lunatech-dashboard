"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DifferentData } from "@/views/dashboard/api/data";
import { CardWrapper } from "@/views/dashboard/components/card-wrapper";
import { lazy, Suspense, useMemo } from "react";

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
  topList: { name: string; count: number }[];
  dataRevenue: {
    month: string;
    revenue?: number;
    quantity?: number;
  }[];
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
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card, index) => (
          <Suspense
            key={index}
            fallback={<Skeleton className="h-32 w-full rounded-lg" />}
          >
            <CardWrapper
              title={card.title}
              value={card.value}
              lastValue={card.lastValue}
              type={card.type as "revenue" | "count"}
              className="transform transition-all hover:shadow-md hover:-translate-y-1"
            />
          </Suspense>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7 auto-cols-min">
        <Suspense
          fallback={<Skeleton className="h-[350px] col-span-4  rounded-lg" />}
        >
          <Revenue data={dataRevenue} className="col-span-4" />
        </Suspense>

        <TopList data={topList} className="col-span-3" />
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
