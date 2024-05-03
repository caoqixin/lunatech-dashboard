import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { RepairTable } from "@/components/tables/v2/repair/repair-table";
import { getAllRepairs } from "@/lib/actions/server/repairs";

interface RepairPageProps {
  search: searchParamsValue;
}
const breadcrumbItems: BreadCrumbType[] = [
  { title: "维修管理", link: "/dashboard/repairs" },
];

export default async function RepairPage({ search }: RepairPageProps) {
  const data = await getAllRepairs(search);

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

        <RepairTable data={data} />
      </>
    </div>
  );
}
