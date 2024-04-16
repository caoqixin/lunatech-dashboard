import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateCusomer from "./create-customer";
import { searchCustomerParamsValue } from "@/schemas/search-params-schema";
import { CustomerTable } from "@/components/tables/v2/customer/customer-table";

interface CustomerPageProps {
  search: searchCustomerParamsValue;
}
const CustomerPage = async ({ search }: CustomerPageProps) => {
  const stringSeatch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSeatch).toString();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "客户中心", link: "/dashboard/customers" },
  ];
  const res = await fetch(
    `${process.env.BASE_URL}/api/v1/customers?${searchParams}`
  );

  const data = await res.json();

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
};

export default CustomerPage;
