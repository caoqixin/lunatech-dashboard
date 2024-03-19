import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Phone } from "@/lib/definitions";
import { brands, phones } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import XinHeader from "../_components/xin-header";
import { DataTable } from "@/components/tables/data-table";
import { Separator } from "@/components/ui/separator";
import CreatePhone from "./create-phone";
import { phoneColumns } from "@/components/tables/columns/phone-columns";
import { unstable_noStore } from "next/cache";
import prisma from "@/lib/prisma";

interface PhonePageProps {
  brandId: number;
}

const PhonePage = async ({ brandId }: PhonePageProps) => {
  unstable_noStore();
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

  const res = await fetch(`http://localhost:3000/api/v1/brands/${brandId}`);

  const data = await res.json();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={brand.name} back>
          <CreatePhone brandId={brandId} />
        </XinHeader>
        <Separator />
        <DataTable columns={phoneColumns} data={data} searchKey="name" />
      </>
    </div>
  );
};

export default PhonePage;
