import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Supplier } from "@/lib/definitions";
import { suppliers } from "@/lib/placeholder-data";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import { supplierColumns } from "@/components/tables/columns/supplier-columns";
import CreateSupplier from "./create-supplier";
import { unstable_noStore } from "next/cache";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "供应商管理", link: "/dashboard/suppliers" },
];

const SupplierPage = async () => {
  unstable_noStore();

  const res = await fetch("http://localhost:3000/api/v1/suppliers");

  const data = await res.json();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="供应商管理">
          <CreateSupplier />
        </XinHeader>
        <Separator />
        <DataTable columns={supplierColumns} data={data} />
      </>
    </div>
  );
};

export default SupplierPage;
