import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import { warrantyColumns } from "@/components/tables/columns/warranty-columns";
import { unstable_noStore } from "next/cache";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "保修管理", link: "/dashboard/warranties" },
];
const WarrantyPage = async () => {
  unstable_noStore();
  const res = await fetch("http://localhost:3000/api/v1/warranties");

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="保修管理">{""}</XinHeader>
        <Separator />
        <DataTable
          columns={warrantyColumns}
          data={data}
          searchKey="contact_tel"
        />
      </>
    </div>
  );
};

export default WarrantyPage;
