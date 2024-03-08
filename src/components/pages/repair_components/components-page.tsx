import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { RepairComponent } from "@/lib/definitions";
import { components } from "@/lib/placeholder-data";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import { componentColumns } from "@/components/tables/columns/component-columns";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "配件管理", link: "/dashboard/components" },
];

async function getData(): Promise<RepairComponent[]> {
  return components;
}

const ComponentPage = async () => {
  const data = await getData();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="配件管理">
          <Button className="text-xs md:text-sm" asChild>
            <Link href="/dashboard/components/create">
              <PlusIcon className="mr-2 h-4 w-4" /> 新增
            </Link>
          </Button>
        </XinHeader>
        <Separator />
        <DataTable columns={componentColumns} data={data} searchKey="code" />
      </>
    </div>
  );
};

export default ComponentPage;
