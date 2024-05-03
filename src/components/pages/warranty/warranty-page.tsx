import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { searchWarrantyParamsValue } from "@/schemas/search-params-schema";
import { WarrantyTable } from "@/components/tables/v2/warranty/warranty-table";
import { getAllWarranties } from "@/lib/actions/server/warranties";

interface WarrantyPageProps {
  search: searchWarrantyParamsValue;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "保修管理", link: "/dashboard/warranties" },
];

export default async function WarrantyPage({ search }: WarrantyPageProps) {
  const data = await getAllWarranties(search);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="保修管理">{""}</XinHeader>
        <Separator />
        <WarrantyTable data={data} />
      </>
    </div>
  );
}
