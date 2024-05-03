import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateCusomer from "./create-customer";
import { searchCustomerParamsValue } from "@/schemas/search-params-schema";
import { CustomerTable } from "@/components/tables/v2/customer/customer-table";
import { getAllCustomers } from "@/lib/actions/server/customers";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "客户中心", link: "/dashboard/customers" },
];
interface CustomerPageProps {
  search: searchCustomerParamsValue;
}

export default async function CustomerPage({ search }: CustomerPageProps) {
  const data = await getAllCustomers(search);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="客户中心">
          <CreateCusomer />
        </XinHeader>
        <Separator />
        <CustomerTable data={data} />
      </>
    </div>
  );
}
