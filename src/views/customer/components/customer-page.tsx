import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";

import { Separator } from "@/components/ui/separator";
import { SearchCustomer } from "@/views/customer/schema/customer.schema";
import { countCustomers, fetchCustomers } from "@/views/customer/api/customer";
import { CreateCustomer } from "@/views/customer/components/create-customer";
import { CustomerTable } from "@/views/customer/components/customer-table";

interface CustomerPageProps {
  search: SearchCustomer;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "客户中心", link: "/dashboard/customers" },
];

export const CustomerPage = async ({ search }: CustomerPageProps) => {
  const [data, count] = await Promise.all([
    fetchCustomers(search),
    countCustomers(search.per_page, search.tel ?? ""),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="客户中心">
        <CreateCustomer />
      </Header>
      <Separator />
      <CustomerTable data={data} count={count} />
    </div>
  );
};
