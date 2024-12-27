import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";

import { SupplierSearchParams } from "@/views/supplier/schema/supplier.schema";

import { SupplierTable } from "@/views/supplier/components/supplier-table";
import { CreateSupplier } from "@/views/supplier/components/create-supplier";

import { countSuppliers, fetchSuppliers } from "@/views/supplier/api/supplier";

import { Separator } from "@/components/ui/separator";

interface SupplierPageProps {
  search: SupplierSearchParams;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "供应商管理", link: "/dashboard/suppliers" },
];

export const SupplierPage = async ({ search }: SupplierPageProps) => {
  const [data, count] = await Promise.all([
    fetchSuppliers(search),
    countSuppliers(search.per_page),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="供应商管理">
        <CreateSupplier />
      </Header>
      <Separator />
      <SupplierTable data={data} count={count} />
    </div>
  );
};
