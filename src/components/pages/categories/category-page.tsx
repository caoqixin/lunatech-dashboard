import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateCategory from "./create-category";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { CategoryTable } from "@/components/tables/v2/category/category-table";
import { getAllCategories } from "@/lib/actions/server/categories";

interface CategoryPageProps {
  search: searchParamsValue;
}

// 面包屑导航条
const breadcrumbItems: BreadCrumbType[] = [
  { title: "分类管理", link: "/dashboard/categories" },
];

export default async function CategoryPage({ search }: CategoryPageProps) {
  const data = await getAllCategories(search);

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
}
