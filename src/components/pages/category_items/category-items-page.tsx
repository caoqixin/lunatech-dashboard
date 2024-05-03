import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { notFound } from "next/navigation";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateCategoryItem from "./create-category-item";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { CategoryItemTable } from "@/components/tables/v2/category_item/category-item-table";
import { getCategoryById } from "@/lib/actions/server/categories";
import { getCategoryItemsById } from "@/lib/actions/server/category_items";

interface CategoryItemPageProps {
  categoryId: number;
  search: searchParamsValue;
}

export default async function CategoryItemPage({
  categoryId,
  search,
}: CategoryItemPageProps) {
  // 获取当前所属分类
  const category = await getCategoryById(categoryId);

  if (category === null) {
    return notFound();
  }

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "分类管理", link: "/dashboard/categories" },
    {
      title: category.name,
      link: `/dashboard/categories/${categoryId}`,
    },
  ];

  const data = await getCategoryItemsById(categoryId, search);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={category.name} back="/dashboard/categories">
          <CreateCategoryItem categoryId={categoryId} />
        </XinHeader>
        <Separator />
        <CategoryItemTable data={data} />
      </>
    </div>
  );
}
