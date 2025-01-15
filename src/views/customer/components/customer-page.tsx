import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";

import { Separator } from "@/components/ui/separator";
import { SearchCustomer } from "@/views/customer/schema/customer.schema";
import {
  countAllCustomers,
  countCustomers,
  fetchCustomers,
} from "@/views/customer/api/customer";
import { CreateCustomer } from "@/views/customer/components/create-customer";
import { CustomerTable } from "@/views/customer/components/customer-table";
import { ExportCustomerButton } from "@/views/customer/components/export-customer-button";

interface CustomerPageProps {
  search: SearchCustomer;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "客户中心", link: "/dashboard/customers" },
];

export const CustomerPage = async ({ search }: CustomerPageProps) => {
  const [data, count, allCustomers] = await Promise.all([
    fetchCustomers(search),
    countCustomers(search.per_page, search.tel ?? ""),
    countAllCustomers(),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="客户中心">
        <div className="flex gap-2">
          <ExportCustomerButton customerCounts={allCustomers} />
          <CreateCustomer />
        </div>
      </Header>
      <Separator />
      <CustomerTable data={data} count={count} />
    </div>
  );
};
