import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "订单管理", link: "/dashboard/orders" },
];
const OrderPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="订单管理">
          <Button className="text-xs md:text-sm" asChild>
            <Link href="/dashboard/orders/create">
              <PlusIcon className="mr-2 h-4 w-4" /> 新增
            </Link>
          </Button>
        </XinHeader>
        <Separator />
        {/* <DataTable columns={componentColumns} data={data} searchKey="code" /> */}
      </>
    </div>
  );
};

export default OrderPage;
