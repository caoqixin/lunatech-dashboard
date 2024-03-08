import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Brand } from "@/lib/definitions";
import { brands } from "@/lib/placeholder-data";
import XinHeader from "../_components/xin-header";
import { DataTable } from "@/components/tables/data-table";
import { Separator } from "@/components/ui/separator";
import CreateBrand from "./create-brand";
import { brandColumns } from "@/components/tables/columns/brand-columns";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "分类管理", link: "/dashboard/categories" },
];

async function getData(): Promise<Brand[]> {
  return brands;
}

const BrandPage = async () => {
  const data = await getData();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="手机品牌管理">
          <CreateBrand />
        </XinHeader>
        <Separator />
        <DataTable columns={brandColumns} data={data} />
      </>
    </div>
  );
};

export default BrandPage;
