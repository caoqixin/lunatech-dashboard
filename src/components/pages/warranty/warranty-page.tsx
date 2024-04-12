import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { unstable_noStore } from "next/cache";
import { searchWarrantyParamsValue } from "@/schemas/search-params-schema";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { WarrantyTable } from "@/components/tables/v2/warranty/warranty-table";

interface WarrantyPageProps {
  search: searchWarrantyParamsValue;
}

const WarrantyPage = async ({ search }: WarrantyPageProps) => {
  unstable_noStore();

  const stringSearch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSearch).toString();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "保修管理", link: "/dashboard/warranties" },
  ];
  const res = await fetch(
    `http://localhost:3000/api/v1/warranties?${searchParams}`
  );

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="保修管理">{""}</XinHeader>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={5} />}>
          <WarrantyTable data={data} />
        </Suspense>
      </>
    </div>
  );
};

export default WarrantyPage;
