import DashboardDataSkeleton from "@/components/pages/_components/skeleton/dashboard-data-skeleton";
import CategoryPage from "@/components/pages/categories/category-page";
import { SearchParams } from "@/components/tables/v2/types";
import { auth } from "@/lib/user";
import { searchParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "分类管理",
};

export interface CategoryPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: CategoryPageProps) {
  await auth();
  const search = searchParamsSchema.parse(searchParams);
  return (
    <Suspense fallback={<DashboardDataSkeleton />}>
      <CategoryPage search={search} />
    </Suspense>
  );
}
