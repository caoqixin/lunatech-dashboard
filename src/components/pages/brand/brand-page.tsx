import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateBrand from "./create-brand";
import { searchPhoneParamsValue } from "@/schemas/search-params-schema";
import { BrandTable } from "@/components/tables/v2/brand/brand-table";
import ImportBrand from "./import-brand";
import { getAllBrands } from "@/lib/actions/server/brands";

interface BrandPageProps {
  search: searchPhoneParamsValue;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "手机品牌管理", link: "/dashboard/phones" },
];

export default async function BrandPage({ search }: BrandPageProps) {
  const data = await getAllBrands(search);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="手机品牌管理">
          <ImportBrand />
          <CreateBrand />
        </XinHeader>
        <Separator />
        <BrandTable data={data} />
      </>
    </div>
  );
}
