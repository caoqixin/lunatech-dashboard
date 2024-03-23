import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateCusomer from "./create-customer";
import { unstable_noStore } from "next/cache";
import { searchCustomerParamsValue } from "@/schemas/search-params-schema";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { CustomerTable } from "@/components/tables/v2/customer/customer-table";

interface CustomerPageProps {
  search: searchCustomerParamsValue;
}
const CustomerPage = async ({ search }: CustomerPageProps) => {
  unstable_noStore();
  const stringSeatch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSeatch).toString();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "客户中心", link: "/dashboard/customers" },
  ];
  const res = await fetch(
    `http://localhost:3000/api/v1/customers?${searchParams}`
  );

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="客户中心">
          <CreateCusomer />
        </XinHeader>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={5} />}>
          <CustomerTable data={data} />
        </Suspense>
      </>
    </div>
  );
};

export default CustomerPage;
