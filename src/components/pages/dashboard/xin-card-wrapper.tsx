import React, { Suspense } from "react";
import XinCard from "@/components/pages/_components/xin-card";
import CardSkeleton from "@/components/pages/_components/card-skeleton";
import { fetchData } from "@/lib/actions/data";
import { toEUR } from "@/lib/utils";

export const revalidate = 0;

const XinCardWrapper = async () => {
  const { totalRepairs, monthlyRepairs, annualy, monthly, component } =
    await fetchData();

  return (
    <>
      <Suspense fallback={<CardSkeleton />}>
        <XinCard title="年收入" value={toEUR(annualy ?? 0)} />
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <XinCard title="月收入" value={toEUR(monthly ?? 0)} />
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <XinCard title="总维修数" value={totalRepairs} />
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <XinCard title="月维修" value={monthlyRepairs} />
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <XinCard title="配件总数" value={component.count._sum.stock ?? 0} />
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <XinCard title="配件价格" value={toEUR(component.totalAmount)} />
      </Suspense>
    </>
  );
};

export default XinCardWrapper;
