import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { notFound } from "next/navigation";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreatePhone from "./create-phone";
import prisma from "@/lib/prisma";
import { searchPhoneParamsValue } from "@/schemas/search-params-schema";
import { PhoneTable } from "@/components/tables/v2/phone/phone-table";

interface PhonePageProps {
  brandId: number;
  search: searchPhoneParamsValue;
}

const PhonePage = async ({ brandId, search }: PhonePageProps) => {
  const stringSearch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSearch).toString();

  const brand = await prisma.brand.findFirst({
    where: {
      id: brandId,
    },
  });

  if (brand === null) {
    return notFound();
  }

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "手机品牌管理", link: "/dashboard/phones" },
    { title: brand.name, link: `/dashboard/phones/${brandId}` },
  ];

  const res = await fetch(
    `http://localhost:3000/api/v1/brands/${brandId}?${searchParams}`
  );

  const data = await res.json();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={brand.name} back="/dashboard/phones">
          <CreatePhone brandId={brandId} />
        </XinHeader>
        <Separator />

        <PhoneTable data={data} />
      </>
    </div>
  );
};

export default PhonePage;
