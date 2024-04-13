import DashboardDataSkeleton from "@/components/pages/_components/skeleton/dashboard-data-skeleton";
import ComponentPage from "@/components/pages/repair_components/components-page";
import { SearchParams } from "@/components/tables/v2/types";
import { auth } from "@/lib/user";
import { searchComponentParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "配件管理",
};

export interface ComponentPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: ComponentPageProps) {
  await auth();

  const search = searchComponentParamsSchema.parse(searchParams);
  return (
    <Suspense fallback={<DashboardDataSkeleton searchaBle />}>
      <ComponentPage search={search} />
    </Suspense>
  );
}
