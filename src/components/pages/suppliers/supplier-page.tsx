import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateSupplier from "./create-supplier";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { SupplierTable } from "@/components/tables/v2/supplier/supplier-table";

interface SupplierPageProps {
  search: searchParamsValue;
}
const SupplierPage = async ({ search }: SupplierPageProps) => {
  const stringSeatch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSeatch).toString();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "供应商管理", link: "/dashboard/suppliers" },
  ];
  const res = await fetch(
    `${process.env.BASE_URL}/api/v1/suppliers?${searchParams}`
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
        <SupplierTable data={data} />
      </>
    </div>
  );
};

export default SupplierPage;
