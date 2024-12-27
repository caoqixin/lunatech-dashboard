import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { SearchWarranty } from "@/views/warranty/schema/warranty.schema";
import { countWarranties, fetchWarranties } from "../api/warranty";
import { WarrantyTable } from "./warranty-table";

interface WarrantyPageProps {
  params: SearchWarranty;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "保修管理", link: "/dashboard/warranties" },
];

export const WarrantyPage = async ({ params }: WarrantyPageProps) => {
  const [data, count] = await Promise.all([
    fetchWarranties(params),
    countWarranties(params),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="保修管理">{""}</Header>
      <Separator />
      <WarrantyTable data={data} count={count} />
    </div>
  );
};
