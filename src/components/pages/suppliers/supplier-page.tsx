import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Supplier } from "@/lib/definitions";
import { suppliers } from "@/lib/placeholder-data";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import { supplierColumns } from "@/components/tables/columns/supplier-columns";
import CreateSupplier from "./create-supplier";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "供应商管理", link: "/dashboard/suppliers" },
];

async function getData(): Promise<Supplier[]> {
  return suppliers;
}

const SupplierPage = async () => {
  const data = await getData();
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
