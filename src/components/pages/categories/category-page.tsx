import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateCategory from "./create-category";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { CategoryTable } from "@/components/tables/v2/category/category-table";

interface CategoryPageProps {
  search: searchParamsValue;
}

const CategoryPage = async ({ search }: CategoryPageProps) => {
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
        <CategoryTable data={data} />
      </>
    </div>
  );
};

export default CategoryPage;
