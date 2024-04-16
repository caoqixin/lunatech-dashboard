import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateBrand from "./create-brand";
import { searchPhoneParamsValue } from "@/schemas/search-params-schema";
import { BrandTable } from "@/components/tables/v2/brand/brand-table";
import ImportBrand from "./import-brand";

interface BrandPageProps {
  search: searchPhoneParamsValue;
}

const BrandPage = async ({ search }: BrandPageProps) => {
  const stringSeatch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSeatch).toString();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "手机品牌管理", link: "/dashboard/brands" },
  ];

  const res = await fetch(
    `${process.env.BASE_URL}/api/v1/brands?${searchParams}`
  );

  const data = await res.json();

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
};

export default BrandPage;
