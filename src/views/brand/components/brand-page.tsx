import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { CreateBrand } from "@/views/brand/components/create-brand";
import { fetchBrands } from "@/views/brand/api/brand";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import { BrandSearch } from "@/views/brand/schema/brand.schema";

interface BrandPageProps {
  searchKey: BrandSearch;
}

const InfoList = dynamic(() => import("@/views/brand/components/info-list"), {
  ssr: false,
  loading: () => {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  },
});

const breadcrumbItems: BreadCrumbType[] = [
  { title: "手机品牌管理", link: "/dashboard/phones" },
];

export const BrandPage = async ({ searchKey }: BrandPageProps) => {
  const data = await fetchBrands(searchKey.key);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="手机品牌管理">
        <CreateBrand />
      </Header>
      <Separator />
      <InfoList brands={data} />
    </div>
  );
};
