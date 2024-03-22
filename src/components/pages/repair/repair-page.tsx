import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import { repairColumns } from "@/components/tables/columns/repair-columns";
import { revalidatePath, unstable_noStore } from "next/cache";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "维修管理", link: "/dashboard/repairs" },
];
const RepairPage = async () => {
  unstable_noStore();
  const res = await fetch("http://localhost:3000/api/v1/repairs");

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="维修管理">
          <Button className="text-xs md:text-sm" asChild>
            <Link href="/dashboard/repairs/create">
              <PlusIcon className="mr-2 h-4 w-4" /> 新增
            </Link>
          </Button>
        </XinHeader>
        <Separator />
        <DataTable columns={repairColumns} data={data} />
      </>
    </div>
  );
};

export default RepairPage;
