import DashboardDataSkeleton from "@/components/pages/_components/skeleton/dashboard-data-skeleton";
import CustomerPage from "@/components/pages/customer/customer-page";
import { SearchParams } from "@/components/tables/v2/types";
import { auth } from "@/lib/user";
import { searchCustomerParamsSchema } from "@/schemas/search-params-schema";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "客户中心",
};

export interface CustomerPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: CustomerPageProps) {
  await auth();

  const search = searchCustomerParamsSchema.parse(searchParams);

  return (
    <Suspense fallback={<DashboardDataSkeleton searchaBle />}>
      <CustomerPage search={search} />
    </Suspense>
  );
}
