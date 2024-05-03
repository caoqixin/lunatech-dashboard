import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { searchComponentParamsValue } from "@/schemas/search-params-schema";
import { ComponentTable } from "@/components/tables/v2/repair_component/component-table";
import { DataTableFilterableColumn } from "@/components/tables/v2/types";
import {
  getAllComponents,
  getCategoryForComponent,
} from "@/lib/actions/server/repair_components";
import { ClientComponent } from "@/lib/definitions";

interface ComponentPageProps {
  search: searchComponentParamsValue;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "配件管理", link: "/dashboard/components" },
];

export default async function ComponentPage({ search }: ComponentPageProps) {
  const categories = await getCategoryForComponent("repair_category");
  const data = await getAllComponents(search);

  if (!categories) {
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
          <ComponentTable data={data} />
        </>
      </div>
    );
  }

  const filterableColumns: DataTableFilterableColumn<ClientComponent>[] = [
    {
      id: "category",
      title: "分类",
      options: categories,
    },
  ];

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
        <ComponentTable data={data} filterColumn={filterableColumns} />
      </>
    </div>
  );
}
