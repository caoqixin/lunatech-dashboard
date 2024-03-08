import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Phone } from "@/lib/definitions";
import { brands, phones } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import XinHeader from "../_components/xin-header";
import { DataTable } from "@/components/tables/data-table";
import { Separator } from "@/components/ui/separator";
import CreatePhone from "./create-phone";
import { phoneColumns } from "@/components/tables/columns/phone-columns";

interface PhonePageProps {
  brandId: number;
}

async function getData(brandId: number): Promise<Phone[]> {
  return phones.filter((items) => {
    return items.brandId === brandId;
  });
}

const PhonePage = async ({ brandId }: PhonePageProps) => {
  const brandTitle = brands.find((items) => {
    return items.id === brandId;
  });

  if (brandTitle === undefined) {
    return notFound();
  }

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "手机品牌管理", link: "/dashboard/phones" },
    { title: brandTitle.name, link: `/dashboard/phones/${brandId}` },
  ];

  const data = await getData(brandId);
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={brandTitle.name} back>
          <CreatePhone />
        </XinHeader>
        <Separator />
        <DataTable columns={phoneColumns} data={data} searchKey="name" />
      </>
    </div>
  );
};

export default PhonePage;
