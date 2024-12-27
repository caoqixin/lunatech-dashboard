import { SearchPhoneParams } from "@/views/phones/schema/phone.schema";
import { fetchPhonesByBrand, fetchPhoneTitleByBrandId } from "../api/phone";
import { notFound } from "next/navigation";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { PhoneTable } from "@/views/phones/components/phone-table";
import { CreatePhone } from "@/views/phones/components/create-phone";

interface PhonePageProps {
  brandId: string;
  search: SearchPhoneParams;
}

export const PhonePage = async ({ brandId, search }: PhonePageProps) => {
  const phoneBrand = await fetchPhoneTitleByBrandId(
    brandId as unknown as number
  );

  if (!phoneBrand) {
    return notFound();
  }

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "手机品牌管理", link: "/dashboard/phones" },
    { title: phoneBrand.name, link: `/dashboard/phones/${brandId}` },
  ];

  const [data, count] = await fetchPhonesByBrand(
    brandId as unknown as number,
    search
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title={phoneBrand.name} back="/dashboard/phones">
        <CreatePhone brandId={brandId} />
      </Header>
      <Separator />
      <PhoneTable data={data} count={count} />
    </div>
  );
};
