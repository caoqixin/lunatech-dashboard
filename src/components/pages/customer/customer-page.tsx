import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Customer } from "@/lib/definitions";
import { customers } from "@/lib/placeholder-data";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import { customerColumns } from "@/components/tables/columns/customer-columns";
import CreateCusomer from "./create-customer";
import { unstable_noStore } from "next/cache";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "客户中心", link: "/dashboard/customers" },
];

const CustomerPage = async () => {
  unstable_noStore();
  const res = await fetch("http://localhost:3000/api/v1/customers");

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="客户中心">
          <CreateCusomer />
        </XinHeader>
        <Separator />
        <DataTable columns={customerColumns} data={data} searchKey="tel" />
      </>
    </div>
  );
};

export default CustomerPage;
