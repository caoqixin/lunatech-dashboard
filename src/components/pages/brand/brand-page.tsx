import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { DataTable } from "@/components/tables/data-table";
import { Separator } from "@/components/ui/separator";
import CreateBrand from "./create-brand";
import { brandColumns } from "@/components/tables/columns/brand-columns";
import { unstable_noStore } from "next/cache";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "手机品牌管理", link: "/dashboard/brands" },
];
const BrandPage = async () => {
  unstable_noStore();
  const res = await fetch("http://localhost:3000/api/v1/brands");

  const data = await res.json();
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
