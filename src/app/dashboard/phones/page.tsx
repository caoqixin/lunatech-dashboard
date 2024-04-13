import DashboardDataSkeleton from "@/components/pages/_components/skeleton/dashboard-data-skeleton";
import BrandPage from "@/components/pages/brand/brand-page";
import { SearchParams } from "@/components/tables/v2/types";
import { auth } from "@/lib/user";
import { searchPhoneParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "机型管理",
};

export interface BrandPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: BrandPageProps) {
  await auth();

  const search = searchPhoneParamsSchema.parse(searchParams);

  return (
    <Suspense fallback={<DashboardDataSkeleton searchaBle />}>
      <BrandPage search={search} />
    </Suspense>
  );
}
