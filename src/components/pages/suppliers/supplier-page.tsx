import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateSupplier from "./create-supplier";
import { unstable_noStore } from "next/cache";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { SupplierTable } from "@/components/tables/v2/supplier/supplier-table";

interface SupplierPageProps {
  search: searchParamsValue;
}
const SupplierPage = async ({ search }: SupplierPageProps) => {
  unstable_noStore();

  const stringSeatch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSeatch).toString();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "供应商管理", link: "/dashboard/suppliers" },
  ];
  const res = await fetch(
    `http://localhost:3000/api/v1/suppliers?${searchParams}`
  );

  const data = await res.json();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="供应商管理">
          <CreateSupplier />
        </XinHeader>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={5} />}>
          <SupplierTable data={data} />
        </Suspense>
      </>
    </div>
  );
};

export default SupplierPage;
