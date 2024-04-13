import DashboardDataSkeleton from "@/components/pages/_components/skeleton/dashboard-data-skeleton";
import RepairPage from "@/components/pages/repair/repair-page";
import { SearchParams } from "@/components/tables/v2/types";
import { auth } from "@/lib/user";
import { searchParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "维修管理",
};

export interface RepairPageProps {
  searchParams: SearchParams;
}
export default async function Page({ searchParams }: RepairPageProps) {
  await auth();

  const search = searchParamsSchema.parse(searchParams);
  return (
    <Suspense fallback={<DashboardDataSkeleton />}>
      <RepairPage search={search} />
    </Suspense>
  );
}
