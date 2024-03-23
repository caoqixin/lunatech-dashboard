import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateCategory from "./create-category";
import { unstable_noStore } from "next/cache";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { CategoryTable } from "@/components/tables/v2/category/category-table";

interface CategoryPageProps {
  search: searchParamsValue;
}

const CategoryPage = async ({ search }: CategoryPageProps) => {
  unstable_noStore();
  const stringSeatch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSeatch).toString();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "分类管理", link: "/dashboard/categories" },
  ];
  const res = await fetch(
    `http://localhost:3000/api/v1/categories?${searchParams}`
  );

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="分类管理">
          <CreateCategory />
        </XinHeader>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={3} rowCount={5} />}>
          <CategoryTable data={data} />
        </Suspense>
      </>
    </div>
  );
};

export default CategoryPage;
